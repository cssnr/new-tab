<script setup lang="ts">
import { type Ref, ref, onMounted, inject } from 'vue'
import { type Options, getOptions, saveKeyValue, saveOptions } from '@/utils/options.ts'
import { getBookmarkFolders } from '@/utils/bookmarks.ts'

const options = inject<Ref<Options | undefined>>('options')

const allBookmarks = ref<chrome.bookmarks.BookmarkTreeNode[] | null>(null)
const selectedFolder = ref<chrome.bookmarks.BookmarkTreeNode | undefined>(undefined)

function handleFolderSelect(e: Event) {
  console.log('handleFolderSelect:', allBookmarks)
  if (!allBookmarks?.value) return
  const title = (e.target as HTMLInputElement).value
  console.log('title:', title)
  const match = allBookmarks.value.find((f) => f.title === title)
  console.log('match:', match)

  selectedFolder.value = match
  saveKeyValue('folderId', match?.id ?? '')
}

onMounted(async () => {
  allBookmarks.value = await getBookmarkFolders()
  const options = await getOptions()
  const match = allBookmarks.value.find((f) => f.id === options.folderId)
  console.log('match:', match)
  selectedFolder.value = match
})
</script>

<template>
  <label for="folderId" class="form-label"
    ><i class="fa-solid fa-bookmark"></i> Bookmarks Folder
    <i
      class="fa-solid fa-circle-info p-1"
      data-bs-toggle="tooltip"
      data-bs-title="Bookmarks Folder to Display."
      v-bs
    ></i
  ></label>
  <input
    class="form-control"
    list="datalistOptions"
    placeholder="Enter a folder..."
    :value="selectedFolder?.title"
    @change="handleFolderSelect"
  />
  <datalist id="datalistOptions">
    <option v-for="folder of allBookmarks" :key="folder.id" :value="folder.title" />
  </datalist>

  <label for="numBookmarks" class="form-label visually-hidden">Number of Top Sites</label>
  <div class="d-flex align-items-center gap-2">
    <output for="numBookmarks" class="fw-bold">{{ options?.numBookmarks }}</output>
    <input
      v-if="options"
      v-model="options.numBookmarks"
      @change="saveOptions"
      id="numBookmarks"
      class="form-range flex-grow-1"
      type="range"
      min="0"
      max="12"
    />
  </div>
</template>
