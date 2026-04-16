<script setup lang="ts">
import { openUrl } from '@/utils/index.ts'

console.debug('%cLOADED: BookmarksFolder.vue', 'color: Orange')

const bookmarks = inject<Ref<chrome.bookmarks.BookmarkTreeNode[] | undefined>>('bookmarks')

function getFaviconUrl(mark: chrome.bookmarks.BookmarkTreeNode): string | undefined {
  // console.log('getFaviconUrl:', site)
  // if (mark.favicon) return site.favicon
  if (!mark.url) return
  const url = new URL(chrome.runtime.getURL('/_favicon/'))
  url.searchParams.set('pageUrl', mark.url)
  url.searchParams.set('size', '32')
  return url.toString()
}
</script>

<template>
  <div v-if="bookmarks?.length" class="d-flex flex-wrap gap-1 justify-content-center">
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
