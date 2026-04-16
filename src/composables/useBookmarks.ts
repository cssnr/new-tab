import { onMounted, onUnmounted, ref } from 'vue'
import { getOptions } from '@/utils/options.ts'
import { getBookmarkFolders } from '@/utils/bookmarks.ts'

const bookmarks = ref<chrome.bookmarks.BookmarkTreeNode[]>([])

async function updateBookmarks() {
  const options = await getOptions()
  console.log('%c onMounted:', 'color: Orange', options.value)

  const folders = await getBookmarkFolders()
  console.log('folders:', folders)
  // foldersRef.value = folders

  const selected = folders.find((f) => f.id === options.folderId)
  console.log('selected:', selected)
  // if (selected) selectedFolder.value = selected

  bookmarks.value = selected?.children?.filter((node) => node.url) ?? []
}

async function onChanged(changes: Record<string, any>) {
  // console.log('useBookmarks - onChanged:', changes)
  const items = changes.options // NOTE: Lazy Typing...
  // console.log('items:', items)
  if (!items?.oldValue || !items?.newValue) return
  if (items.oldValue.folderId !== items.newValue.folderId) {
    console.log('%c Bookmark Folder Change', 'color: LightSkyBlue')
    await updateBookmarks()
  }
}

export function useBookmarks() {
  // console.log('%cLOADED composables/useBookmarks.ts', 'color: Cyan')

  if (!chrome.storage.sync.onChanged.hasListener(onChanged)) {
    chrome.storage.sync.onChanged.addListener(onChanged)
  }

  onMounted(updateBookmarks)
  onUnmounted(() => chrome.storage.sync.onChanged.removeListener(onChanged))

  return bookmarks
}
