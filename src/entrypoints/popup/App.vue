<script setup lang="ts">
import { computed } from 'vue'
import { isFirefox, isMobile } from '@/utils/system.ts'
import ToastAlerts from '@/components/ToastAlerts.vue'
import PanelHeader from '@/components/PanelHeader.vue'
import OptionsForm from '@/components/OptionsForm.vue'
import PermsCheck from '@/components/PermsCheck.vue'
import SearchBox from '@/components/SearchBox.vue'

let isBrowser = isFirefox ? '420px' : null
const width = computed(() => (isMobile ? '100%' : isBrowser))
console.log('width:', width.value)
</script>

<template>
  <div id="popupContainer">
    <PanelHeader :close-window="true" :popup-button="false" />

    <div class="d-grid gap-2 p-1">
      <PermsCheck :close-window="true" />
      <SearchBox :close-window="true" :new-tab="true" :expanded-rows="2" />
    </div>

    <OptionsForm :show="['switches']" class="p-2" />

    <ToastAlerts />
  </div>
</template>

<style scoped>
#popupContainer {
  width: v-bind(width);
}
</style>
