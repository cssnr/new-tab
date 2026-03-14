import { openExtPanel, openPopup, openSidePanel } from '@/utils/extension.ts'

const contexts: chrome.contextMenus.CreateProperties[] = [
  { contexts: ['all'], id: 'openPopup', title: 'Open Popup' },
  { contexts: ['all'], id: 'openSidePanel', title: 'Open Side Panel' },
  { contexts: ['all'], id: 'openExtPanel', title: 'Open Extension Panel' },
  { contexts: ['all'], id: '4jaqIR9b', type: 'separator' },
  { contexts: ['all'], id: 'openOptions', title: 'Open Options' },
]

// NOTE: Below is ported from VanillaJS

export function createContextMenus() {
  console.debug('createContextMenus')
  if (!chrome.contextMenus) {
    return console.debug('Skipping: chrome.contextMenus')
  }
  chrome.contextMenus.removeAll().then(() => {
    contexts.forEach((item) => chrome.contextMenus.create(item))
  })
}

export async function onClicked(
  ctx: chrome.contextMenus.OnClickData,
  tab?: chrome.tabs.Tab,
) {
  console.debug('onClicked:', ctx, tab)
  if (ctx.menuItemId === 'openOptions') {
    await chrome.runtime.openOptionsPage()
  } else if (ctx.menuItemId === 'openPopup') {
    await openPopup()
  } else if (ctx.menuItemId === 'openExtPanel') {
    await openExtPanel()
  } else if (ctx.menuItemId === 'openSidePanel') {
    openSidePanel()
  } else {
    console.error(`Unknown ctx.menuItemId: ${ctx.menuItemId}`)
  }
}
