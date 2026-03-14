<script setup lang="ts">
import { useTitle } from '@/composables/useTitle.ts'

import ToastAlerts from '@/components/ToastAlerts.vue'
import BackToTop from '@/components/BackToTop.vue'
import PanelHeader from '@/components/PanelHeader.vue'
import PageFooter from '@/components/PageFooter.vue'
import ButtonsList from '@/components/ButtonsList.vue'
import SearchBox from '@/components/SearchBox.vue'

useTitle('Page')
</script>

<template>
  <header class="flex-shrink-0">
    <PanelHeader />
  </header>

  <main class="flex-grow-1">
    <div class="container-fluid p-3 h-100">
      <h1>Page</h1>
      <SearchBox class="m-3" />
      <ButtonsList :page-button="false" class="m-3" />
    </div>
  </main>

  <footer class="flex-shrink-0">
    <hr class="my-0" />
    <PageFooter class="m-3" />
  </footer>

  <ToastAlerts />
  <BackToTop />
</template>

<!--<style scoped></style>-->
