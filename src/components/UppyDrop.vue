<script setup lang="ts">
import { ref, onMounted, onUnmounted, useTemplateRef } from 'vue'
import { useWallpaperDB } from '@/composables/useWallpaperDB.ts'
import { Modal } from 'bootstrap'
import Uppy from '@uppy/core'
import DropTarget from '@uppy/drop-target'
import '@uppy/core/css/style.css'
import '@uppy/drop-target/css/style.css'
import { showToast } from '@/composables/useToast.ts'

const { addImage } = useWallpaperDB()

const mediaType = ref<'image' | 'video' | ''>('')

const imageModal = useTemplateRef('imageModal')
let modal: Modal

const mediaSrc = ref<string>('')
let uppy: Uppy

async function processUpload() {
  console.log('processUpload:', mediaSrc.value)
  if (!mediaSrc.value) return
  // const imageBlob = base64ToBlob(mediaSrc.value)
  const base64Response = await fetch(mediaSrc.value)
  // console.log('base64Response:', base64Response)
  const blob = await base64Response.blob()
  console.log('blob:', blob)
  await addImage(blob)
  modal.hide()
}

// function base64ToBlob(base64String: string) {
//   // Handle data URLs like "data:image/png;base64,ABC123..."
//   const [metadata, data] = base64String.split(',')
//   const mimeType = metadata.match(/:(.*?);/)[1]
//   const byteCharacters = atob(data)
//   const byteArray = new Uint8Array(byteCharacters.length)
//   for (let i = 0; i < byteCharacters.length; i++) {
//     byteArray[i] = byteCharacters.charCodeAt(i)
//   }
//   return new Blob([byteArray], { type: mimeType })
// }

onMounted(() => {
  modal = new Modal(imageModal.value!)

  imageModal.value!.addEventListener('hidden.bs.modal', () => {
    // mediaSrc.value = null
    uppy.clear()
  })

  uppy = new Uppy().use(DropTarget, {
    target: document.body,
  })

  uppy.on('file-added', (file) => {
    const reader = new FileReader()
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const result = e.target?.result as string
      console.log('reader.onload - result:', result)
      if (!result) return
      if (result.startsWith('data:image')) {
        mediaType.value = 'image'
      } else if (result.startsWith('data:video')) {
        mediaType.value = 'video'
      } else {
        return showToast('Unsupported Media Type', 'danger')
      }
      // mediaType.value = result.startsWith('image') ? 'image' : 'video'
      mediaSrc.value = result
      modal.show()
    }
    reader.readAsDataURL(file.data as File)
  })
})

onUnmounted(() => {
  uppy.destroy()
})
</script>

<template>
  <div
    class="modal modal-lg fade"
    id="image-modal"
    ref="imageModal"
    tabindex="-1"
    aria-labelledby="image-modal-label"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 id="image-modal-label" class="modal-title fs-5 text-capitalize">Upload {{ mediaType }}</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" tabindex="-1"></button>
        </div>
        <div class="modal-body text-center p-2">
          <div class="modal-body text-center p-2">
            <!--TODO: Add re-usable image/video component...-->
            <img
              v-if="mediaSrc && mediaType === 'image'"
              :src="mediaSrc"
              alt="Image"
              class="modal-img img-fluid img-thumbnail"
            />
            <video
              class="modal-img img-fluid img-thumbnail"
              v-if="mediaSrc && mediaType === 'video'"
              :src="mediaSrc"
              playsinline
              autoplay
              muted
              loop
            ></video>
          </div>
        </div>
        <div class="modal-footer p-2">
          <button type="button" class="btn btn-success me-auto" @click="processUpload()">
            Upload <i class="fa-solid fa-upload ms-2"></i>
          </button>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-img {
  object-fit: cover;
  max-width: 100%;
  max-height: 50vh;
  padding: 0.15rem;
  border-radius: 0.5rem;
}
</style>
