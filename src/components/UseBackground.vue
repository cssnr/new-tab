<script setup lang="ts">
import { onMounted, onUnmounted, ref, useTemplateRef } from 'vue'
import { type Options, getOptions } from '@/utils/options.ts'
import { useWallpaperDB } from '@/composables/useWallpaperDB.ts'

const { deleteId, getAll, getSelected, toggleSelected, wallpaperDBChannel } = useWallpaperDB()

const bgRef = ref<RadioBackground>('bgNone')
const pictureURL = ref('')
const videoURL = ref('')

const video = useTemplateRef('video')

async function setBackground(options: Options) {
  console.log('setBackground:', options.radioBackground)
  if (!video.value) return console.warn('no video element')

  bgRef.value = options.radioBackground
  pictureURL.value = options.pictureURL
  videoURL.value = options.videoURL

  // NOTE: Copied from VanillaJS. Refactor this method...
  if (options.radioBackground === 'bgPicture') {
    const url = options.pictureURL || 'https://picsum.photos/1920/1080'
    document.body.style.background = `url('${url}') no-repeat center fixed`
    document.body.style.backgroundSize = 'cover'
    video.value.classList.add('d-none')
  } else if (options.radioBackground === 'bgVideo') {
    video.value.src = options.videoURL
    video.value.classList.remove('d-none')
    document.body.style.cssText = ''
  } else if (options.radioBackground === 'bgLocal') {
    video.value.classList.add('d-none')
    document.body.style.cssText = ''
    // TODO: WIP - use selected background
    const selected = await getSelected()
    console.log('selected:', selected)
    const getRandomElement = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)]
    const randomElement = getRandomElement(selected)
    console.log('rand:', randomElement)
    if (randomElement?.data) {
      // Convert the Blob to an object URL
      const srcUrl = URL.createObjectURL(randomElement.data)
      console.log('srcUrl:', srcUrl)
      if (randomElement.data.type.startsWith('image')) {
        document.body.style.background = `url('${srcUrl}') no-repeat center fixed`
        document.body.style.backgroundSize = 'cover'
        video.value.classList.add('d-none')
      } else if (randomElement.data.type.startsWith('video')) {
        video.value.src = srcUrl
        video.value.classList.remove('d-none')
        document.body.style.cssText = ''
      }
    }
  } else {
    document.body.style.cssText = ''
    video.value.classList.add('d-none')
  }
}

async function onChanged(changes: Record<string, any>) {
  console.log('BackgroundForm.vue - onChanged:', changes)
  if (!changes?.options?.oldValue || !changes?.options?.newValue) return
  if (
    changes.options.oldValue.radioBackground !== changes.options.newValue.radioBackground ||
    changes.options.oldValue.pictureURL !== changes.options.newValue.pictureURL ||
    changes.options.oldValue.videoURL !== changes.options.newValue.videoURL
  ) {
    console.log('%c Background Change Detected.', 'color: LightSkyBlue')
    setBackground(changes.options.newValue)
  }
}

if (!chrome.storage.sync.onChanged.hasListener(onChanged)) {
  chrome.storage.sync.onChanged.addListener(onChanged)
}

onMounted(() => getOptions().then(setBackground).catch(console.warn))
onUnmounted(() => chrome.storage.sync.onChanged.removeListener(onChanged))
</script>

<template>
  <Teleport to="body">
    <video ref="video" class="d-none" playsinline autoplay muted loop></video>
  </Teleport>
</template>

<style scoped>
video {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
}
</style>
