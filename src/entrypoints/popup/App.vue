<script setup lang="ts">
import { computed } from 'vue'
import { isFirefox, isMobile } from '@/utils/system.ts'
import ToastAlerts from '@/components/ToastAlerts.vue'
import PanelHeader from '@/components/PanelHeader.vue'
import OptionsForm from '@/components/OptionsForm.vue'
import ButtonsList from '@/components/ButtonsList.vue'
import PermsCheck from '@/components/PermsCheck.vue'
import SearchBox from '@/components/SearchBox.vue'

let isBrowser = isFirefox ? '420px' : null
const width = computed(() => (isMobile ? '100%' : isBrowser))
console.log('width:', width.value)

// const warningRef = ref('')
// const owner = ref('')
// const repo = ref('')

// onMounted(() => {
//   console.log('window.location.href:', window.location.href)
//   // const repository = getOwnerRepo(window.location.href)
//   // console.log('repository:', repository)
//   chrome.tabs.query({ currentWindow: true, active: true }).then((tabs) => {
//     console.log('tabs:', tabs)
//     if (tabs.length) {
//       console.log('url:', tabs[0].url)
//       const result = getOwnerRepo(tabs[0].url)
//       if (result) {
//         owner.value = result.owner
//         repo.value = result.name
//       } else {
//         warningRef.value = 'Not a GitHub Repository'
//       }
//       console.log('repo:', result)
//     }
//   })
// })
</script>

<template>
  <div id="popupContainer">
    <PanelHeader :close-window="true" :popup-button="false" />

    <div class="d-grid gap-2 p-1">
      <PermsCheck />
      <SearchBox :close-window="true" :new-tab="true" :expanded-rows="2" />
      <ButtonsList :close-window="true" :popup-button="false" />
    </div>

    <!--<div v-if="warningRef" class="alert alert-warning text-center p-3 m-2" role="alert">{{ warningRef }}</div>-->
    <!--<BadgesView v-if="owner && repo" :owner :repo />-->

    <!--<div v-if="warningRef">-->
    <!--  <hr class="my-0" />-->
    <!--  <OptionsForm :close-window="true" :show="['switches']" class="p-2" />-->
    <!--</div>-->
    <OptionsForm :show="['switches']" class="p-2" />

    <ToastAlerts />
  </div>
</template>

<style scoped>
#popupContainer {
  width: v-bind(width);
}
</style>
