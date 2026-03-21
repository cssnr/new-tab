// NOTE: Below is ported from VanillaJS

import { showToast } from '@/composables/useToast.ts'

export function openSidePanel(close?: boolean) {
  console.debug('openSidePanel:', close)
  if (chrome.sidePanel) {
    console.debug('chrome.sidePanel')
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      chrome.sidePanel
        .open({ windowId: tab.windowId })
        .then(() => {
          if (close) window.close()
        })
        .catch((e) => console.warn(e))
    })
  } else if (chrome.sidebarAction) {
    console.debug('chrome.sidebarAction')
    chrome.sidebarAction.open()
    if (close) window.close()
  } else {
    console.log('Side Panel Not Supported')
  }
}

export function openOptions(close = false) {
  console.debug('openOptions')
  chrome.runtime
    .openOptionsPage()
    .then(() => {
      if (close) window.close()
    })
    .catch((e) => console.warn(e))
}

export async function openPage(close = false, path = 'page.html') {
  console.debug('openPage:', path)
  const page = chrome.runtime.getURL(path)
  await activateOrOpen(page)
  if (close) window.close()
}

export async function openPopup() {
  console.debug('openPopup')
  // Note: This fails if popup is already open (ex. double clicks)
  try {
    await chrome.action.openPopup()
  } catch (e) {
    console.debug(e)
  }
}

export async function openExtPanel(close = false) {
  console.debug('openExtPanel:', close)

  const panelPath = 'popout.html'
  const [defaultWidth, defaultHeight] = [390, 600]
  const type = chrome.windows.CreateType.POPUP

  if (!chrome.windows) {
    console.log('Browser does not support: chrome.windows')
    showToast('Browser does not support windows', 'danger')
    return
  }

  const local = await chrome.storage.local.get([
    'lastPanelID',
    'panelWidth',
    'panelHeight',
  ])
  console.debug('local:', local)

  const lastPanelID = local.lastPanelID as number
  console.debug('lastPanelID:', lastPanelID)

  try {
    const panel = await chrome.windows.get(lastPanelID)
    // console.debug('window', window)
    if (panel) {
      console.debug(`%c Window found: ${panel.id}`, 'color: Lime')
      await chrome.windows.update(lastPanelID, { focused: true })
      if (close) window.close()
      return
    }
  } catch (e) {
    console.log(e)
  }

  const panelWidth = local.panelWidth as number
  console.debug('panelWidth:', panelWidth)
  const panelHeight = local.panelHeight as number
  console.debug('panelHeight:', panelHeight)
  const width = panelWidth || defaultWidth
  const height = panelHeight || defaultHeight
  console.debug(`width, height:`, width, height)
  const url = chrome.runtime.getURL(panelPath)
  console.debug('url:', url)
  const panel = await chrome.windows.create({ type, url, width, height })
  console.debug('panel:', panel)
  if (panel) {
    console.debug(`%c Created new window: ${panel.id}`, 'color: Magenta')
    chrome.storage.local.set({ lastPanelID: panel.id }).catch((e) => console.warn(e))
  }
  if (close) window.close()
}

export async function activateOrOpen(url: string, open = true) {
  console.debug('activateOrOpen:', url, open)
  // Note: To Get Tab from Tabs (requires host permissions or tabs)
  const tabs = await chrome.tabs.query({ currentWindow: true })
  console.debug('tabs:', tabs)
  for (const tab of tabs) {
    if (tab.url === url) {
      console.debug('%cTab found, activating:', 'color: Lime', tab)
      return await chrome.tabs.update(tab.id, { active: true })
    }
  }
  if (open) {
    console.debug('%cTab not found, opening url:', 'color: Yellow', url)
    return await chrome.tabs.create({ active: true, url })
  }
  console.warn('tab not found and open not set!')
}

export function clickOpen(e: Event, close = false) {
  const target = e.currentTarget as HTMLAnchorElement
  let url = target.href
  console.log('clickOpen:', close, url)
  if (!url || url === '#') return
  if (url.startsWith('/')) {
    url = chrome.runtime.getURL(url)
  }
  activateOrOpen(url).then(() => {
    if (close || target.dataset.close === 'true') window.close()
  })
}
