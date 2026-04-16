import { onMounted, onUnmounted } from 'vue'
import { type Options, getOptions } from '@/utils/options.ts'

function setBackground(options: Options) {
  // NOTE: Copied from VanillaJS. Refactor this method...
  console.log('useBackground.ts - setBackground:', options)

  const video = document.querySelector('video')
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

async function onChanged(changes: Record<string, any>) {
  // console.log('useBackground - onChanged:', changes)
  const items = changes.options // NOTE: Lazy Typing...
  // console.log('items:', items)
  if (!items?.oldValue || !items?.newValue) return
  if (
    items.oldValue.radioBackground !== items.newValue.radioBackground ||
    items.oldValue.pictureURL !== items.newValue.pictureURL ||
    items.oldValue.videoURL !== items.newValue.videoURL
  ) {
    console.log('%c Background Option Change Detected.', 'color: LightSkyBlue')
    setBackground(items.newValue)
  }
}

export function useBackground() {
  // console.log('%cLOADED composables/useBackground.ts', 'color: Cyan')

  if (!chrome.storage.sync.onChanged.hasListener(onChanged)) {
    chrome.storage.sync.onChanged.addListener(onChanged)
  }

  onMounted(() => getOptions().then(setBackground).catch(console.warn))
  onUnmounted(() => chrome.storage.sync.onChanged.removeListener(onChanged))
}
