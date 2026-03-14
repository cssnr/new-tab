export function useTitle(page: string) {
  const manifest = chrome.runtime.getManifest()
  console.debug('manifest:', manifest)
  document.title = `${manifest.name} ${page}`
}
