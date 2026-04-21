<script setup lang="ts">
import { onMounted } from 'vue'
import { getTextColor, getTimeSince } from '@/utils'
import { getOptions } from '@/utils/options.ts'
import { getIssues, getOwnerRepo } from '@/utils/github.ts'
import type { Endpoints } from '@octokit/types'

type SearchIssuesResponse = Endpoints['GET /search/issues']['response']['data']['items']

const issues = ref<SearchIssuesResponse | null>(null)

const parsedIssues = computed(() => issues.value?.map((issue) => ({ ...issue, repo: getOwnerRepo(issue.html_url) })))

const needsUpdate = (cd: number, updated?: number) => {
  return updated ? Math.floor((Date.now() - updated) / 1000 / 60) >= cd : true
}

onMounted(async () => {
  const options = await getOptions()
  console.log('options.githubToken:', options.githubToken.slice(0, 10))
  // TODO: Ensure this view is not shown if no githubToken is set...
  if (!options.githubToken) return console.log('%cMissing githubToken', 'color: Yellow')

  const storage = await chrome.storage.local.get(['issues', 'issuesUpdated'])
  console.log('storage:', storage)

  console.log('issues:', storage.issues)
  if (storage.issues) issues.value = storage.issues as SearchIssuesResponse

  // TODO: a reusable function to check and update issues...
  console.log('issuesUpdated:', storage.issuesUpdated)
  if (needsUpdate(options.githubCooldown, storage.issuesUpdated as number | undefined)) {
    console.log('%c UPDATING ISSUES...', 'color: Yellow')
    const results = await getIssues(options.githubToken)
    console.log('results:', results)
    if (results) {
      issues.value = results
      await chrome.storage.local.set({ issues: results, issuesUpdated: Date.now() })
    }
  }
})
</script>

<template>
  <table class="table table-sm table-hover table-striped" style="table-layout: fixed">
    <colgroup>
      <col style="width: 34px" />
      <col style="width: 70%" />
      <col style="width: 30%" />
      <col style="width: 120px" />
      <col style="width: 34px" />
    </colgroup>
    <thead>
      <tr>
        <th scope="col" class="text-truncate text-center"><i class="fa-regular fa-circle-user"></i></th>
        <th scope="col" class="text-truncate">Issue Title</th>
        <th scope="col" class="text-truncate"><i class="fa-solid fa-code-branch"></i> Repository</th>
        <th scope="col" class="text-truncate"><i class="fa-regular fa-clock"></i> Updated</th>
        <th scope="col" class="text-truncate text-center"><i class="fa-regular fa-comments"></i></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="issue in parsedIssues">
        <td class="align-middle" style="line-height: 1">
          <template v-if="issue.user">
            <a :href="issue.user.html_url"> <img alt="" height="24" :src="issue.user.avatar_url" /></a>
          </template>
        </td>
        <td class="text-truncate align-middle">
          <a :href="issue.html_url" class="link-body-emphasis fw-bold">{{ issue.title }}</a>
          <span
            v-for="label in issue.labels"
            class="badge rounded-pill ms-1"
            :style="{ backgroundColor: `#${label.color}`, color: getTextColor(label.color) }"
            >{{ label.name }}</span
          >
          <span v-if="issue.user" class="text-muted ms-1">{{ issue.user.login }}</span>
        </td>
        <td v-if="issue.repo" class="text-truncate">
          <a :href="issue.repo.url" class="link-body-emphasis"
            >{{ issue.repo.owner }}/{{ issue.repo.name }}#{{ issue.number }}</a
          >
        </td>
        <td v-else class="text-truncate">Unknown</td>
        <td class="text-truncate">{{ getTimeSince(issue.updated_at) }}</td>
        <td class="text-truncate text-center" :class="issue.comments ? 'fw-bold' : 'text-muted'">
          {{ issue.comments }}
        </td>
      </tr>
    </tbody>
  </table>
</template>
