<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { openUrl } from '@/utils'
import { getOptions, saveKeyValue } from '@/utils/options.ts'

console.debug('%cLOADED: BookmarksFolder.vue', 'color: Orange')

const selectedFolder = ref<chrome.bookmarks.BookmarkTreeNode | undefined>(undefined)

const bookmarks = computed(() => selectedFolder.value?.children?.filter((node) => node.url) ?? [])

function handleFolderSelect(e: Event) {
  const title = (e.target as HTMLInputElement).value
  console.log('title:', title)
  const match = foldersRef.value.find((f) => f.title === title)
  console.log('match:', match)

  selectedFolder.value = match
  // saveOptions(e)
  saveKeyValue('folderId', match?.id ?? '')

  // if (match) {
  //   console.log('folderId:', match.id)
  //   console.log('match.title:', match.title)
  //   selectedFolder.value = match
  //   // saveOptions(e)
  //   saveKeyValue('folderId', match.id)
  // }
}

const foldersRef = ref<chrome.bookmarks.BookmarkTreeNode[]>([])
// const bookmarksRef = ref<chrome.bookmarks.BookmarkTreeNode[]>([])

async function getBookmarkFolders() {
  const folders: chrome.bookmarks.BookmarkTreeNode[] = []
  function logFolders(nodes: chrome.bookmarks.BookmarkTreeNode[]): void {
    nodes.forEach((node) => {
      if (node.children) {
        console.log('folder:', node.title)
        if (node.title) folders.push(node)
        // recurse into children
        logFolders(node.children)
      }
    })
  }

  const tree = await chrome.bookmarks.getTree()
  logFolders(tree)
  return folders
}

function getFaviconUrl(mark: chrome.bookmarks.BookmarkTreeNode): string | undefined {
  // console.log('getFaviconUrl:', site)
  // if (mark.favicon) return site.favicon
  if (!mark.url) return
  const url = new URL(chrome.runtime.getURL('/_favicon/'))
  url.searchParams.set('pageUrl', mark.url)
  url.searchParams.set('size', '32')
  return url.toString()
}

onMounted(async () => {
  console.debug('%cMOUNTED: BookmarksFolder.vue', 'color: Lime')

  // const tree = await chrome.bookmarks.getTree()
  // console.log('tree1:', tree)
  // tree.forEach((item) => {
  //   console.log('item:', item)
  //   item.children?.forEach((child) => {
  //     console.log('child:', child)
  //   })
  // })

  // function logFolders(nodes: chrome.bookmarks.BookmarkTreeNode[]): void {
  //   nodes.forEach((node) => {
  //     if (node.children) {
  //       console.log('folder:', node.title)
  //       // recurse into children
  //       logFolders(node.children)
  //     }
  //   })
  // }

  // const tree = await chrome.bookmarks.getTree()
  // logFolders(tree)

  const folders = await getBookmarkFolders()
  console.log('folders:', folders)
  foldersRef.value = folders
  const options = await getOptions()
  console.log('options.folderId:', options.folderId)
  const selected = foldersRef.value.find((f) => f.id === options.folderId)
  console.log('selected:', selected)
  if (selected) {
    selectedFolder.value = selected
    // console.log('selectedFolder.value:', selectedFolder.value)
    // bookmarksRef.value = await chrome.bookmarks.get(selectedFolder.value.id)
    // console.log('bookmarksRef.value:', bookmarksRef.value)
  }
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
    <option v-for="folder of foldersRef" :key="folder.id" :value="folder.title" />
  </datalist>

  <div class="d-flex flex-wrap gap-1 justify-content-center">
    <a
      v-for="node in bookmarks"
      :key="node.url"
      :href="node.url"
      class="d-flex flex-column align-items-center gap-1 text-decoration-none p-1 rounded top-site"
      style="width: 80px"
      @click.prevent="openUrl(node.url)"
    >
      <img :src="getFaviconUrl(node)" width="32" height="32" alt="" />
      <span class="text-truncate w-100 text-center small fw-bold">{{ node.title || 'Unknown' }}</span>
    </a>
  </div>
</template>

<style scoped>
.top-site {
  filter: drop-shadow(4px 4px 8px var(--bs-black));
  backdrop-filter: blur(6px) brightness(0.75);
}
</style>
