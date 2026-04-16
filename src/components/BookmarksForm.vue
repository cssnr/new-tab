<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getOptions, saveKeyValue } from '@/utils/options.ts'
import { getBookmarkFolders } from '@/utils/bookmarks.ts'

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
  <label for="folderId" class="form-label">Datalist example</label>
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
</template>
