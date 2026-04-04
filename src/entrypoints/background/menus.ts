const config: chrome.contextMenus.CreateProperties[] = [
  { contexts: ['all'], id: 'openPopup' },
  { contexts: ['all'], id: 'openSidePanel' },
  { contexts: ['all'], id: 'openExtPanel' },
  { contexts: ['all'], id: 'separator' },
  { contexts: ['all'], id: 'openOptions' },
]

const contexts: chrome.contextMenus.CreateProperties[] = config.map((entry) => ({
  ...entry,
  ...(entry.id === 'separator'
    ? { type: 'separator', id: crypto.randomUUID() }
    : { title: i18n.t(`ctx.${entry.id}` as any) }),
}))

export function createContextMenus() {
  console.debug('createContextMenus')
  if (!chrome.contextMenus) {
    return console.debug('Skipping: chrome.contextMenus')
  }
  chrome.contextMenus.removeAll().then(() => {
    contexts.forEach((item) => chrome.contextMenus.create(item))
  })
}
