<script setup lang="ts">
import { i18n } from '#imports'
import { useTitle } from '@/composables/useTitle.ts'
import { useBackground } from '@/composables/useBackground.ts'
import { isFirefox } from '@/utils/system.ts'
import BackToTop from '@/components/BackToTop.vue'
import PermsCheck from '@/components/PermsCheck.vue'
import ToastAlerts from '@/components/ToastAlerts.vue'
import OptionsForm from '@/components/OptionsForm.vue'
import KeyboardShortcuts from '@/components/KeyboardShortcuts.vue'
import PageFooter from '@/components/PageFooter.vue'
import CopySupport from '@/components/CopySupport.vue'
import PageHeader from '@/components/PageHeader.vue'
import HorizontalRule from '@/components/HorizontalRule.vue'

console.debug('%c options/App.vue', 'color: Lime')

useTitle(i18n.t('options.title'))

useBackground()
</script>

<template>
  <div class="d-flex align-items-center justify-content-center h-100 w-100 p-1 p-sm-3">
    <div class="m-auto pb-4 w-100">
      <div id="options-wrapper" class="glass-outline rounded rounded-3 w-100 m-auto p-2 p-sm-3">
        <PageHeader />

        <KeyboardShortcuts />

        <HorizontalRule>New Tab Options</HorizontalRule>
        <OptionsForm />

        <PermsCheck :show-info="true" :show-remove="isFirefox" class="my-3" />

        <CopySupport
          class="fst-italic small mx-3"
          :message="i18n.t('options.copySupportMsg')"
          :tip="i18n.t('options.copySupportTip')"
          >{{ i18n.t('options.copySupport') }}</CopySupport
        >

        <hr />

        <PageFooter />
      </div>
    </div>
  </div>

  <ToastAlerts />
  <BackToTop />
</template>

<style scoped>
#options-wrapper {
  max-width: 767px;
}
</style>
