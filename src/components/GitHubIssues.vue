<script setup lang="ts">
import { onMounted } from 'vue'
import { getOptions } from '@/utils/options.ts'
import { Octokit, RequestError } from 'octokit'
import type { Endpoints } from '@octokit/types'

type SearchIssuesResponse = Endpoints['GET /search/issues']['response']['data']['items']

const issues = ref<SearchIssuesResponse | null>(null)

onMounted(async () => {
  const options = await getOptions()
  console.log('options.githubToken:', options.githubToken)
  if (!options.githubToken) return console.log('%cMissing githubToken', 'color: Yellow')
  const octokit = new Octokit({ auth: options.githubToken })

  const result = await chrome.storage.local.get(['etag', 'cachedIssues'])
  console.log('result:', result)
  const etag = result['etag'] as string | null | undefined
  const cachedIssues = result['cachedIssues'] as SearchIssuesResponse | undefined
  console.log('etag:', etag)
  console.log('cachedIssues:', cachedIssues)

  const params: Parameters<typeof octokit.rest.search.issuesAndPullRequests>[0] = {
    q: 'is:open is:pr author:@me',
    headers: etag ? { 'If-None-Match': etag } : {},
  }
  console.log('params:', params)

  try {
    const { data, headers } = await octokit.rest.search.issuesAndPullRequests(params)
    console.log('data.items?.length:', data.items?.length)
    issues.value = data.items

    console.log('headers:', headers)
    console.log('headers.etag:', headers.etag)
    await chrome.storage.local.set({ cachedIssues: data.items, etag: headers.etag ?? null })
  } catch (e) {
    console.log('e.status:', (e as any)?.status)

    console.log('cachedIssues.length:', cachedIssues?.length)
    if (cachedIssues) {
      issues.value = cachedIssues
    }

    if (e instanceof RequestError && e.status === 304) return
    console.error(e)
  }
})
</script>

<template>
  <ul>
    <li v-for="issue in issues">{{ issue.title }}</li>
  </ul>
</template>
