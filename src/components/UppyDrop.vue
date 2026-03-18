<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useWallpaperDB } from '@/composables/useWallpaperDB.ts'
import { Modal } from 'bootstrap'
import Uppy from '@uppy/core'
import DropTarget from '@uppy/drop-target'
import '@uppy/core/css/style.css'
import '@uppy/drop-target/css/style.css'

const { addImage } = useWallpaperDB()

const imageModal = ref<HTMLElement | null>(null)
let modal: Modal

const imageSrc = ref<string | null>(null)
let uppy: Uppy

async function processUpload() {
  console.log('processUpload:', imageSrc.value)
  if (!imageSrc.value) return
  // const imageBlob = base64ToBlob(imageSrc.value)
  const base64Response = await fetch(imageSrc.value)
  console.log('base64Response:', base64Response)
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
    // imageSrc.value = null
    uppy.clear()
  })

  uppy = new Uppy().use(DropTarget, {
    target: document.body,
  })

  uppy.on('file-added', (file) => {
    const reader = new FileReader()
    reader.onload = (e: ProgressEvent<FileReader>) => {
      console.log('File contents:', e.target?.result)
      imageSrc.value = e.target?.result as string
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
          <h1 class="modal-title fs-5" id="image-modal-label">Upload Image</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" tabindex="-1"></button>
        </div>
        <div class="modal-body text-center p-2">
          <div class="modal-body text-center p-2">
            <img v-if="imageSrc" :src="imageSrc" alt="Image" class="modal-img img-fluid img-thumbnail" />
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
