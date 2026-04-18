<script setup lang="ts">
import { Ref, computed, inject } from 'vue'
import { openUrl } from '@/utils/index.ts'

const props = withDefaults(
  defineProps<{
    numItems?: number
    textRows?: number
    size?: number
  }>(),
  {
    numItems: undefined,
    textRows: 1,
    size: 80,
  },
)

const width = computed(() => props.size + 'px')

console.debug('%cLOADED: BookmarksFolder.vue', 'color: Orange')

const bookmarks = inject<Ref<chrome.bookmarks.BookmarkTreeNode[] | undefined>>('bookmarks')

const bookmarksShown = computed(() =>
  props.numItems === 0 ? bookmarks?.value : bookmarks?.value?.slice(0, props.numItems),
)

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
  <div v-if="bookmarksShown?.length" class="d-flex flex-wrap gap-2 justify-content-center">
    <a
      v-for="node in bookmarksShown"
      :key="node.url"
      :href="node.url"
      class="top-site d-flex flex-column align-items-center gap-1 text-decoration-none rounded"
      @click.prevent="openUrl(node.url)"
    >
      <img :src="getFaviconUrl(node)" class="rounded rounded-3 p-1" alt="" />
      <span class="text-center small" :style="{ maxHeight: `calc(1.2em * ${props.textRows})` }">{{
        node.title || 'Unknown'
      }}</span>
    </a>
  </div>
</template>

<style scoped>
.top-site {
  width: v-bind(width);
  filter: drop-shadow(4px 4px 8px var(--bs-black));
  backdrop-filter: blur(6px) brightness(0.75);
}

.top-site img {
  width: 100%;
  height: auto;
  aspect-ratio: 1 / 1;
  object-fit: contain;
  margin-bottom: -8px;
}

.top-site span {
  width: 100%;
  display: block;
  overflow: hidden;
  word-break: break-word;
  line-height: 1.2em;
}
</style>
