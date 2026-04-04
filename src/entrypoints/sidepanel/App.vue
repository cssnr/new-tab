<script setup lang="ts">
import ButtonsList from '@/components/ButtonsList.vue'
import ToastAlerts from '@/components/ToastAlerts.vue'
import BackToTop from '@/components/BackToTop.vue'
import PanelHeader from '@/components/PanelHeader.vue'
import SearchBox from '@/components/SearchBox.vue'
import PanelFooter from '@/components/PanelFooter.vue'
import PermsCheck from '@/components/PermsCheck.vue'
import OptionsForm from '@/components/OptionsForm.vue'

console.debug('%c sidepanel/App.vue', 'color: Lime')
</script>

<template>
  <header class="flex-shrink-0">
    <PanelHeader :side-button="false" />
  </header>

  <main class="flex-grow-1 overflow-auto p-1">
    <div class="d-grid gap-2">
      <PermsCheck />
      <SearchBox :new-tab="true" :expanded-rows="4" />
      <ButtonsList :side-button="false" />
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
