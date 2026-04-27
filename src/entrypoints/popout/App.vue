<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { debounce } from '@/utils/index.ts'
import { useTitle } from '@/composables/useTitle.ts'
import ToastAlerts from '@/components/ToastAlerts.vue'
import BackToTop from '@/components/BackToTop.vue'
import PanelHeader from '@/components/PanelHeader.vue'
import SearchBox from '@/components/SearchBox.vue'
import PanelFooter from '@/components/PanelFooter.vue'
import PermsCheck from '@/components/PermsCheck.vue'
import OptionsForm from '@/components/OptionsForm.vue'

console.debug('%c popout/App.vue', 'color: Lime')

useTitle('Panel')

async function windowResize() {
  const size = { panelWidth: window.outerWidth, panelHeight: window.outerHeight }
  console.debug('windowResize:', size)
  await chrome.storage.local.set(size).catch(console.warn)
}

const debounceWindowResize = debounce(windowResize, 600)

onMounted(() => {
  window.addEventListener('resize', debounceWindowResize)
  chrome.windows.getCurrent().then((window) => {
    chrome.storage.local.set({ lastPanelID: window.id }).then(() => {
      console.debug('%cSet lastPanelID:', 'color: SpringGreen', window.id)
    })
  })
})
onUnmounted(() => window.removeEventListener('resize', debounceWindowResize))
</script>

<template>
  <header class="flex-shrink-0">
    <PanelHeader :panel-button="false" :side-button="false" :popup-button="false" />
  </header>

  <main class="flex-grow-1 overflow-auto p-1">
    <div class="d-grid gap-2">
      <PermsCheck />
      <SearchBox :new-tab="true" :expanded-rows="4" />
    </div>
  </main>

  <footer class="flex-shrink-0">
    <OptionsForm :show="['switches']" class="p-2" />
    <PanelFooter />
  </footer>

  <ToastAlerts />
  <BackToTop />
</template>

<!--<style scoped></style>-->
