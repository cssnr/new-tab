import { getAppConfig } from '#imports'
import { isFirefox } from '@/utils/system.ts'
import { defineBackground } from 'wxt/utils/define-background'
import { openExtPanel, openPopup, openSidePanel } from '@/utils/extension.ts'
import { type Options, defaultOptions, getOptions } from '@/utils/options.ts'
import { updateIssues } from '@/utils/github.ts'
import { createContextMenus } from './menus.ts'

export default defineBackground(() => {
  console.log(`Loaded: %c${chrome.runtime.id}`, 'Color: Cyan')

  chrome.runtime.onInstalled.addListener(onInstalled)
  chrome.runtime.onStartup.addListener(onStartup)
  chrome.storage.sync.onChanged.addListener(onChanged)
  chrome.runtime.onMessage.addListener(onMessage)
  chrome.commands?.onCommand.addListener(onCommand)
  chrome.contextMenus?.onClicked.addListener(onClicked)

  // chrome.alarms.onAlarm.addListener(onAlarm)
})

// function onAlarm(alarm: chrome.alarms.Alarm) {
//   console.log('onAlarm:', alarm)
// }
//
// async function setAlarms() {
//   const alarm = await chrome.alarms.get('issues')
//   console.log('setAlarms:', alarm)
//
//   if (!alarm) {
//     console.log('%c chrome.alarms.create', 'color: Lime')
//     await chrome.alarms.create('issues', { periodInMinutes: 1 })
//   }
// }

async function onInstalled(details: chrome.runtime.InstalledDetails) {
  console.log('onInstalled:', details)

  // setAlarms().catch(console.warn)

  const options = await setDefaultOptions(defaultOptions)
  console.debug('options:', options)
  if (options.contextMenu) createContextMenus()
  setUninstall().catch(console.warn)
  updateIssues(options).catch(console.warn)

  if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    await chrome.runtime.openOptionsPage()
  } else if (details.reason === chrome.runtime.OnInstalledReason.UPDATE) {
    const config = getAppConfig()
    if (options.showUpdate && config.version !== details.previousVersion) {
      const url = `${config.githubUrl}/releases/tag/${config.version}`
      await chrome.tabs.create({ active: false, url })
    }
  }
}

async function onStartup() {
  console.log('onStartup')
  if (isFirefox) {
    console.log('Firefox Startup Workarounds')
    const options = await getOptions()
    console.debug('options:', options)
    if (options.contextMenu) createContextMenus()
    setUninstall().catch(console.warn)
    updateIssues(options).catch(console.warn)
  }
}

function onChanged(changes: Record<string, chrome.storage.StorageChange>) {
  console.log('%c background/index.ts - onChanged:', 'color: Cyan', changes)
  if (changes?.options) {
    const oldValue = changes.options?.oldValue as Options | undefined
    const newValue = changes.options?.newValue as Options | undefined
    if (!oldValue || !newValue) return console.log('missing oldValue or newValue')

    if (oldValue?.contextMenu !== newValue.contextMenu) {
      if (newValue.contextMenu) {
        console.log('%c Enabled contextMenu...', 'color: Lime')
        createContextMenus()
      } else {
        console.log('%c Disabled contextMenu...', 'color: OrangeRed')
        chrome.contextMenus?.removeAll().catch(console.warn)
      }
    }
  }
}

function onMessage(
  message: any,
  _sender: chrome.runtime.MessageSender,
  _sendResponse: Function,
) {
  console.log('onMessage:', message)
  if (message === 'openPopup') {
    openPopup().catch((e) => console.log(e))
  }
}

async function onCommand(command: string, tab?: chrome.tabs.Tab) {
  console.debug('onCommand:', command, tab)
  if (command === 'openOptions') {
    await chrome.runtime.openOptionsPage()
  } else if (command === 'openExtPanel') {
    await openExtPanel()
  } else if (command === 'openSidePanel') {
    openSidePanel()
  } else {
    console.warn(`Unknown Command: ${command}`)
  }
}

async function onClicked(ctx: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab) {
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

async function setDefaultOptions(defaultOptions: object) {
  console.log('setDefaultOptions', defaultOptions)
  const options = await getOptions()
  let changed = false
  for (const [key, value] of Object.entries(defaultOptions)) {
    // console.log(`${key}: default: ${value} current: ${options[key]}`)
    if (options[key] === undefined) {
      changed = true
      options[key] = value
      console.log(`Set %c${key}:`, 'color: Khaki', value)
    }
  }
  if (changed) {
    await chrome.storage.sync.set({ options })
    console.log('set changed options:', options)
  }
  return options
}

async function setUninstall() {
  // NOTE: Calling this setUninstallURL and using getAppConfig breaks WXT
  const config = getAppConfig()
  const url = new URL(config.uninstallUrl)
  url.searchParams.append('version', config.version)
  url.searchParams.append('id', chrome.runtime.id)
  console.log('setUninstallURL:', url.href)
  await chrome.runtime.setUninstallURL(url.href)
}
