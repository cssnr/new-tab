<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useWallpaperDB, WallpaperData } from '@/composables/useWallpaperDB.ts'
import { Modal } from 'bootstrap'

const { getAll, deleteId, toggleSelected, wallpaperDBChannel } = useWallpaperDB()

const deleteModalEl = ref<HTMLElement | null>(null)
const imagesRef = ref<WallpaperData[]>([])
const selectedImage = ref<WallpaperData | null>(null)

const updateImages = async () => (imagesRef.value = await getAll())

onMounted(async () => {
  await updateImages()
  wallpaperDBChannel.onmessage = updateImages
})

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

function onClick(e: Event) {
  console.log('onClick:', e)
  const target = e.currentTarget as HTMLImageElement
  console.log('target:', target)
  // console.log('src:', target.src)
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
  console.log('id:', selectedImage.value?.id!!)
  if (!selectedImage.value?.id) return
  Modal.getOrCreateInstance(deleteModalEl.value!).hide()
  await deleteId(selectedImage.value?.id)
  await updateImages()
}
</script>

<template>
  <div class="container py-4">
    <div class="row g-3">
      <div class="col-6 col-sm-4 col-md-3 col-lg-2" v-for="(image, i) in imagesRef" :key="i">
        <div
          class="position-relative overflow-hidden rounded rounded-3 border border-3 ratio ratio-1x1 bg-opacity-50 bg-black"
          :class="[image.selected ? 'border-warning' : '']"
        >
          <img
            :src="getImageUrl(image.data)"
            :alt="`Wallpaper ${image.id}`"
            class="wallpaper-img"
            :data-idx="i"
            @click="selectItem(image)"
          />
        </div>
      </div>
    </div>
  </div>

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
          <h1 class="modal-title fs-5" id="delete-modal-label">Delete Image</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" tabindex="-1"></button>
        </div>
        <div class="modal-body text-center p-2">
          <p class="mb-1">Confirm deleting your shitty image?</p>
          <img v-if="selectedImage" class="modal-img" :src="getImageUrl(selectedImage.data)" alt="trash" />
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
</style>
