<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { isFirefox } from '@/utils/system.ts'
import { openUrl } from '@/utils'

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

console.debug('%cLOADED: TopSites.vue', 'color: Orange', props)

const topSites = ref<browser.topSites.MostVisitedURL[] | chrome.topSites.MostVisitedURL[]>([])
const topSitesShown = computed(() =>
  props.numItems !== undefined ? topSites.value.slice(0, props.numItems) : topSites.value,
)
// const iconSize = computed(() => props.iconSize)

function getFaviconUrl(site: chrome.topSites.MostVisitedURL): string {
  // console.log('getFaviconUrl:', site)
  if (site.favicon) return site.favicon
  const url = new URL(chrome.runtime.getURL('/_favicon/'))
  url.searchParams.set('pageUrl', site.url)
  url.searchParams.set('size', props.size.toString())
  return url.toString()
}

function getTopSites() {
  if (isFirefox) {
    const options = { includeFavicon: true }
    return browser.topSites.get(options)
  } else {
    return chrome.topSites.get()
  }
}

onMounted(async () => {
  console.debug('%cMOUNTED: TopSites.vue', 'color: Lime')
  topSites.value = await getTopSites()
  console.log('topSites.value:', topSites.value)
})
</script>

<template>
  <div class="d-flex flex-wrap gap-2 justify-content-center">
    <a
      v-for="site in topSitesShown"
      :key="site.url"
      :href="site.url"
      class="d-flex flex-column align-items-center gap-1 text-decoration-none rounded top-site"
      :style="{ width: `${props.size}px` }"
      @click.prevent="openUrl(site.url)"
    >
      <img :src="getFaviconUrl(site)" class="top-site-icon rounded rounded-3 p-1" alt="" />
      <span class="top-site-label w-100 text-center small" :style="{ maxHeight: `calc(1.2em * ${props.textRows})` }">
        {{ site.title || 'Unknown' }}
      </span>
    </a>
  </div>
</template>

<style scoped>
.top-site {
  filter: drop-shadow(4px 4px 8px var(--bs-black));
  backdrop-filter: blur(6px) brightness(0.75);
}

.top-site-icon {
  width: 100%;
  height: auto;
  aspect-ratio: 1 / 1;
  object-fit: contain;
}

.top-site span {
  display: block;
  overflow: hidden;
  word-break: break-word;
  line-height: 1.2em;
}
</style>
