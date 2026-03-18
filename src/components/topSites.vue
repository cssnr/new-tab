<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { isFirefox } from '@/utils/system.ts'
import { openUrl } from '@/utils'

const topSites = ref<browser.topSites.MostVisitedURL[] | chrome.topSites.MostVisitedURL[]>([])

console.debug('%cLOADED: topSites.vue', 'color: Orange')

function getFaviconUrl(site: chrome.topSites.MostVisitedURL): string {
  // console.log('getFaviconUrl:', site)
  if (site.favicon) return site.favicon
  const url = new URL(chrome.runtime.getURL('/_favicon/'))
  url.searchParams.set('pageUrl', site.url)
  url.searchParams.set('size', '32')
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
  console.debug('%cMOUNTED: topSites.vue', 'color: Lime')
  topSites.value = await getTopSites()
  console.log('topSites.value:', topSites.value)
})
</script>

<template>
  <div class="d-flex flex-wrap gap-1 justify-content-center">
    <a
      v-for="site in topSites"
      :key="site.url"
      :href="site.url"
      class="d-flex flex-column align-items-center gap-1 text-decoration-none p-1 rounded top-site"
      style="width: 80px"
      @click.prevent="openUrl(site.url)"
    >
      <img :src="getFaviconUrl(site)" width="32" height="32" alt="" />
      <span class="text-truncate w-100 text-center small fw-bold">{{ site.title || 'Unknown' }}</span>
    </a>
  </div>
</template>

<style scoped>
.top-site {
  filter: drop-shadow(4px 4px 8px var(--bs-black));
  backdrop-filter: blur(6px) brightness(0.75);
}
</style>
