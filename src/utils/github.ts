import { Octokit } from 'octokit'

interface Repository {
  owner: string
  name: string
  url: string
}

export function getOwnerRepo(fullUrl?: string) {
  // console.log('getOwnerRepo:', fullUrl)
  if (!fullUrl) return null
  const hosts = ['github.com']
  try {
    const url = new URL(fullUrl)
    if (!hosts.includes(url.host)) {
      return null
    }
    const parts = url.pathname.replace('/', '').split('/')
    if (parts.length < 2 || !parts[0] || !parts[1]) {
      return null
    }
    return {
      owner: parts[0],
      name: parts[1],
      url: `${url.protocol}//${url.host}/${parts[0]}/${parts[1]}`,
    } as Repository
  } catch (e) {
    console.debug('error:', e)
    return null
  }
}

export async function getIssues(githubToken: string) {
  console.log('%c getIssues:', 'color: SpringGreen', githubToken.slice(0, 10))
  try {
    const octokit = new Octokit({ auth: githubToken })
    const params: Parameters<typeof octokit.rest.search.issuesAndPullRequests>[0] = {
      q: 'is:open is:issue involves:@me',
    }
    console.log('params:', params)
    const { data, headers } = await octokit.rest.search.issuesAndPullRequests(params)
    console.log('headers:', headers)
    console.log('data.items?.length:', data.items?.length)
    return data.items
  } catch (e) {
    console.error(e)
    console.log('updateIssues error status:', (e as any)?.status)
  }
}
