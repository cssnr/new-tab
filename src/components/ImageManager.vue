<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue'
import { type WallpaperData, useWallpaperDB } from '@/composables/useWallpaperDB.ts'
import { showToast } from '@/composables/useToast.ts'
import { Modal } from 'bootstrap'

const { addImage, getAll, deleteId, toggleSelected, wallpaperDBChannel } = useWallpaperDB()

const imagesRef = ref<WallpaperData[]>([])
const selectedImage = ref<WallpaperData | null>(null)

const deleteModalEl = useTemplateRef('deleteModalEl')
const fileInput = useTemplateRef('fileInput')

// TODO: Make a proper useImages to avoid manually calling all...
const updateImages = async () => (imagesRef.value = await getAll())

// Create object URL helper
const getImageUrl = (blob: Blob): string => {
  return URL.createObjectURL(blob)
}

async function selectItem(image: WallpaperData) {
  console.log('selectItem:', image)
  if (!image.id) return
  await toggleSelected(image.id)
  await updateImages()
}

// async function selectItem(e: MouseEvent) {
//   console.log('selectItem:', e)
//   const image = getImage(e)
//   console.log('image:', image)
// }
//
// function getImage(e: Event): WallpaperData | null {
//   const target = e.currentTarget as HTMLImageElement
//   console.log('target:', target)
//   console.log('idx:', target.dataset.idx)
//   if (!target.dataset.idx) return null
//   const image = imagesRef.value[Number.parseInt(target.dataset.idx)]
//   console.log('image:', image)
//   return image
// }

function downloadClick(e: Event) {
  console.log('downloadClick:', e)
  const target = e.currentTarget as HTMLImageElement
  // console.log('target:', target)
  console.log('idx:', target.dataset.idx)
  if (!target.dataset.idx) return
  const image = imagesRef.value[Number.parseInt(target.dataset.idx)]
  console.log('image:', image)
  showToast('INOP: Not Yet Implemented!', 'warning')
}

function deleteClick(e: Event) {
  console.log('deleteClick:', e)
  const target = e.currentTarget as HTMLImageElement
  // console.log('target:', target)
  // TODO: Pass idx as an argument and not parse from event target...
  console.log('idx:', target.dataset.idx)
  if (!target.dataset.idx) return
  const image = imagesRef.value[Number.parseInt(target.dataset.idx)]
  console.log('image:', image)
  selectedImage.value = image
  Modal.getOrCreateInstance(deleteModalEl.value!).show()
}

async function confirmDelete(e: MouseEvent) {
  console.log('confirmDelete:', e)
  // const target = e.currentTarget as HTMLImageElement
  // console.log('target:', target)
  console.log('id:', selectedImage.value?.id)
  if (!selectedImage.value?.id) return
  Modal.getOrCreateInstance(deleteModalEl.value!).hide()
  await deleteId(selectedImage.value?.id)
  await updateImages()
}

async function uploadClick() {
  console.log('uploadClick')
  console.debug('fileInput.value:', fileInput.value)
  fileInput.value?.click()
}

async function fileInputChange(event: Event) {
  console.debug('fileInputChange:', event)
  try {
    const target = event.currentTarget as HTMLInputElement
    console.debug('target:', target)
    const file = target.files?.item(0)
    if (!file) return showToast('File Not Found', 'error')
    console.debug('file:', file)
    await addImage(file)
    await updateImages()
  } catch (e) {
    console.log('Import error:', e)
    if (e instanceof Error) showToast(`Import Error: ${e.message}`, 'warning')
  }
}

// TODO: Figure out a better way than updateImages + wallpaperDBChannel.onmessage...
onMounted(async () => {
  await updateImages()
  wallpaperDBChannel.onmessage = updateImages
})
</script>

<template>
  <div class="container-fluid">
    <div class="row g-2 m-0">
      <div class="col-12 col-sm-6 col-md-3" v-for="(image, i) in imagesRef" :key="i">
        <div
          class="position-relative overflow-hidden rounded rounded-3 border border-3 ratio ratio-1x1 bg-opacity-50 bg-black"
          :class="{ 'border-warning': image.selected }"
        >
          <div>
            <!--TODO: Add re-usable image/video component...-->
            <img
              v-if="image.data.type.startsWith('image')"
              :src="getImageUrl(image.data)"
              :alt="`Image ${image.id}`"
              class="wallpaper-img w-100 h-100 object-fit-cover"
              :data-idx="i"
              @click="selectItem(image)"
            />
            <video
              v-if="image.data.type.startsWith('video')"
              :src="getImageUrl(image.data)"
              class="wallpaper-img w-100 h-100 object-fit-cover"
              :data-idx="i"
              @click="selectItem(image)"
              playsinline
              autoplay
              muted
              loop
            />
            <div class="position-absolute top-0 start-0 w-100 d-flex end gap-2 p-1">
              <button class="btn btn-sm btn-outline-light" :data-idx="i" @click.prevent="downloadClick">
                <i class="fa-solid fa-download"></i>
              </button>
              <button class="btn btn-sm btn-danger ms-auto" :data-idx="i" @click.prevent="deleteClick">
                <i class="fa-regular fa-trash-can"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="!imagesRef?.length"
      class="border border-3 border-dashed rounded rounded-3 text-center p-1"
      role="button"
      @click="uploadClick"
    >
      No saved media. Drag/drop an
      <i class="fa-regular fa-file-image"></i> Image or <i class="fa-regular fa-file-video"></i> Video here...
    </div>
  </div>

  <input ref="fileInput" type="file" style="display: none" @change.prevent="fileInputChange" />

  <Teleport to="body">
    <div
      class="modal modal-lg fade"
      id="delete-modal"
      ref="deleteModalEl"
      tabindex="-1"
      aria-labelledby="delete-modal-label"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <!--TODO: Add function to parse data.type to image or video-->
            <h1 id="delete-modal-label" class="modal-title fs-5">Delete {{ selectedImage?.data.type }}</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" tabindex="-1"></button>
          </div>
          <div class="modal-body text-center p-2">
            <p class="mb-1">Confirm deleting your {{ selectedImage?.data.type }}?</p>
            <!--TODO: Add re-usable image/video component...-->
            <img
              v-if="selectedImage && selectedImage.data.type.startsWith('image')"
              class="modal-img"
              :src="getImageUrl(selectedImage.data)"
              alt="trash"
            />
            <video
              v-if="selectedImage && selectedImage.data.type.startsWith('video')"
              class="modal-img"
              :src="getImageUrl(selectedImage.data)"
              playsinline
              autoplay
              muted
              loop
            />
          </div>
          <div class="modal-footer p-2">
            <button type="button" class="btn btn-danger me-auto" @click="confirmDelete">
              Delete <i class="fa-regular fa-trash-can ms-2"></i>
            </button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.wallpaper-img {
  object-fit: cover;
  width: 100%;
  height: 100%;
  padding: 0.15rem;
  border-radius: 0.5rem;
}
.modal-img {
  object-fit: cover;
  max-width: 100%;
  max-height: 50vh;
  padding: 0.15rem;
  border-radius: 0.5rem;
}

.border-dashed {
  border-style: dashed !important;
}
</style>
