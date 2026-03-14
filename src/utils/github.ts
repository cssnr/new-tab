interface Repository {
  owner: string
  name: string
  url: string
}

export function getOwnerRepo(fullUrl?: string) {
  console.log('getOwnerRepo:', fullUrl)
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
