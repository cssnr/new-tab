export const defaultOptions = {
  // bgImage: 'https://picsum.photos/1920/1080',
  expandedRows: 10,
  maxResults: 10000,
  iconSize: 56,
  textRows: 1,
  showSearch: true,
  showTopSites: true,
  numTopSites: 12,
  contextMenu: true,
  showUpdate: false,

  newTabTitle: 'New Tab',
  githubUrl: 'https://github.com',
  githubToken: '',
  githubCooldown: 5,
  githubPerPage: 40,
  githubSearch: 'is:open involves:@me',

  folderId: '',
  numBookmarks: 12,

  radioBackground: 'bgPicture' as RadioBackground,
  pictureURL: 'https://picsum.photos/1920/1080',
  videoURL: '',
}

export type Options = typeof defaultOptions & { [key: string]: unknown }

export async function getOptions(): Promise<Options> {
  let { options } = await chrome.storage.sync.get(['options'])
  options = options || {}
  return options as Options
}

// NOTE: This is a WIP to replace the VanillaJS saveOptions
export async function saveKeyValue(key: string, value: any) {
  console.debug(`saveKeyValue: ${key}:`, value)
  if (!key || value === undefined) return
  const options = await getOptions()
  if (options[key] === value) return
  options[key] = value
  console.log(`Set %c${key}:`, 'color: Lime', value)
  await chrome.storage.sync.set({ options })
}

// NOTE: Below is from VanillaJS and being replaced with saveKeyValue
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
  } else if (target.type === 'number' || target.type === 'range') {
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
