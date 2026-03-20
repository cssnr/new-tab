import { showToast } from '@/composables/useToast.ts'

export const defaultOptions = {
  bgImage: 'https://picsum.photos/1920/1080',
  expandedRows: 10,
  maxResults: 10000,
  iconSize: 56,
  textRows: 1,
  showTopSites: true,
  numTopSites: 12,
  contextMenu: true,
  showUpdate: false,
  folderId: '',
}

export type Options = typeof defaultOptions & { [key: string]: unknown }

export async function getOptions(): Promise<Options> {
  let { options } = await chrome.storage.sync.get(['options'])
  options = options || {}
  return options as Options
}

// NOTE: This is not used yet...
export async function saveKeyValue(key: string, value: any) /* NOSONAR */ {
  console.debug(`saveKeyValue: ${key}:`, value)
  if (!key || value === undefined) return
  const options = await getOptions()
  if (options[key] === value) return
  options[key] = value
  console.log(`Set %c${key}:`, 'color: Lime', value)
  await chrome.storage.sync.set({ options })
}

// NOTE: Below is ported from VanillaJS

export async function saveOptions(event: Event) /* NOSONAR */ {
  console.debug('saveOptions:', event)
  const options = await getOptions()
  const target = event.target as HTMLInputElement
  let key = target.id
  let value
  if (target.type === 'radio') {
    key = target.name
    const radios = document.getElementsByName(key) as unknown as HTMLInputElement[]
    for (const input of radios) {
      if (input.checked) {
        value = input.id
        break
      }
    }
  } else if (target.type === 'checkbox') {
    value = target.checked
  } else if (target.type === 'number') {
    const number = Number.parseFloat(target.value)
    const toBound = (val: string, fallback: number): number =>
      val != null && val !== '' ? Number.parseFloat(val) : fallback
    if (
      !Number.isNaN(number) &&
      number >= toBound(target.min, -Infinity) &&
      number <= toBound(target.max, Infinity)
    ) {
      // Valid number
      target.value = number.toString()
      value = number
    } else {
      // Invalid number - revert to last saved value
      target.value = String(options[key])
      return
    }
  } else {
    value = target.value
  }
  if (options[key] === value) {
    return console.log(`Value not changed for key: %c${key}`, 'color: Yellow')
  } else if (value !== undefined) {
    options[key] = value
    console.log(`Set %c${key}:`, 'color: Lime', value)
    await chrome.storage.sync.set({ options })
  } else {
    console.warn(`No Value for key: ${key}`)
  }
}

export async function updateOptions() {
  const options = await getOptions()
  console.debug('updateOptions:', options)
  for (let [key, value] of Object.entries(options)) {
    if (value === undefined) {
      console.warn('Value undefined for key:', key)
      continue
    }
    // Option Key should be `radioXXX` and values should be the option IDs
    if (key.startsWith('radio')) {
      key = String(value) //NOSONAR
      value = true //NOSONAR
    }
    // console.debug(`${key}: ${value}`)
    const el = document.getElementById(key) as HTMLInputElement
    if (!el) {
      continue
    }
    if (el.tagName !== 'INPUT') {
      el.textContent = String(value)
    } else if (typeof value === 'boolean') {
      el.checked = value
    } else {
      el.value = String(value)
    }
    // if (el.dataset.related) {
    //   hideShowElement(`#${el.dataset.related}`, value)
    // }
  }
}

// function hideShowElement(selector: string, show: boolean, speed = 'fast') {
//   const element = $(`${selector}`)
//   // const element = document.querySelector(selector) as HTMLElement
//   // console.debug('hideShowElement:', show, element)
//   if (show) {
//     element.show(speed)
//   } else {
//     element.hide(speed)
//   }
// }

// NOTE: showToast and copySupport should NOT be in this file...
export async function copySupport(event: Event) {
  console.debug('copySupport:', event)
  event.preventDefault()
  const manifest = chrome.runtime.getManifest()
  const permissions = await chrome.permissions.getAll()
  const { options } = await getOptions()

  const local = await chrome.storage.local.get()

  const result = [
    `${manifest.name} - ${manifest.version}`,
    navigator.userAgent,
    `permissions.origins: ${JSON.stringify(permissions.origins)}`,
    `options: ${JSON.stringify(options)}`,
    `local: ${JSON.stringify(local)}`,
  ]
  const commands = await chrome.commands?.getAll()
  if (commands) {
    result.push(`commands: ${JSON.stringify(commands)}`)
  }
  await navigator.clipboard.writeText(result.join('\n'))
  showToast('Support Information Copied.')
}
