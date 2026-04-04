// composables/useBackground.ts
import { onMounted, onUnmounted } from 'vue'
import { getOptions } from '@/utils/options.ts'

function setBackground(options: Options) {
  // NOTE: Copied from VanillaJS. Refactor this method...
  console.log('setBackground: options.radioBackground:', options.radioBackground)
  const video = document.querySelector('video')
  console.log('video:', video)
  if (!video) return console.error('no video element') // NOTE: Handle Error

  if (options.radioBackground === 'bgPicture') {
    const url = options.pictureURL || 'https://picsum.photos/1920/1080'
    document.body.style.background = `url('${url}') no-repeat center fixed`
    document.body.style.backgroundSize = 'cover'
    video.classList.add('d-none')
  } else if (options.radioBackground === 'bgVideo') {
    video.src = options.videoURL
    video.classList.remove('d-none')
    document.body.style.cssText = ''
  } else {
    document.body.style.cssText = ''
    video.classList.add('d-none')
  }
}

async function onChanged(changes: Record<string, chrome.storage.StorageChange>) {
  console.log('composables/useBackground.ts - onChanged:', changes)
  const records = changes as Record<string, any> // NOTE: Lazy Typing...
  // console.debug('options:', records.options)
  const optionChange = records.options
  if (!optionChange?.oldValue || !optionChange?.newValue) return
  // console.debug('oldValue:', optionChange.oldValue)
  // console.debug('newValue:', optionChange.newValue)
  if (
    optionChange.oldValue.radioBackground !== optionChange.newValue.radioBackground ||
    optionChange.oldValue.pictureURL !== optionChange.newValue.pictureURL ||
    optionChange.oldValue.videoURL !== optionChange.newValue.videoURL
  ) {
    console.log('%c Background Option Change Detected.', 'color: Yellow')
    setBackground(optionChange.newValue)
  }
}

// export function useBackground(options: Ref<Options | null>) {
export function useBackground() {
  // watch(
  //   options,
  //   (opts) => {
  //     if (!opts) return
  //     setBackground(opts)
  //   },
  //   { once: true },
  // )

  if (!chrome.storage.sync.onChanged.hasListener(onChanged)) {
    chrome.storage.sync.onChanged.addListener(onChanged)
  }

  onMounted(async () => {
    console.log('composables/useBackground.ts - onMounted')
    const options = await getOptions()
    setBackground(options)
  })
  onUnmounted(() => chrome.storage.sync.onChanged.removeListener(onChanged))
}
