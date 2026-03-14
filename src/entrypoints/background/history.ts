export function onVisited(result: chrome.history.HistoryItem): void {
  console.log('onVisited', result)
  console.log('result.url', result.url)
}

export function onVisitRemoved(removed: chrome.history.RemovedResult): void {
  console.log('onVisitRemoved', removed)
  console.log('removed.urls', removed.urls)
}
