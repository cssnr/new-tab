<script setup lang="ts">
import { useTitle } from '@/composables/useTitle.ts'
import { isMobile } from '@/utils/system.ts'
import BackToTop from '@/components/BackToTop.vue'
import ToastAlerts from '@/components/ToastAlerts.vue'
import OptionsForm from '@/components/OptionsForm.vue'
import KeyboardShortcuts from '@/components/KeyboardShortcuts.vue'
import PageFooter from '@/components/PageFooter.vue'
import PermsCheck from '@/components/PermsCheck.vue'
import CopySupport from '@/components/CopySupport.vue'
import HorizontalRule from '@/components/HorizontalRule.vue'

console.debug('%c options/App.vue', 'color: Lime')

const manifest = chrome.runtime.getManifest()

useTitle('Options')
</script>

<template>
  <div class="d-flex align-items-center justify-content-center p-1 p-sm-3 h-100 w-100">
    <div class="m-auto pb-4 w-100">
      <div id="options-wrapper" class="glass-outline blur rounded rounded-3 p-2 p-sm-3 m-auto w-100">
        <div class="d-flex flex-row justify-content-center align-items-center">
          <img :src="'/icons/48.png'" class="me-1" height="48" width="48" :alt="manifest.name" :title="manifest.name" />
          <div>
            <a
              class="link-body-emphasis text-decoration-none fs-1"
              title="Home Page"
              :href="manifest.homepage_url"
              target="_blank"
              rel="nofollow"
            >
              {{ manifest.name }}</a
            >
            <a
              class="link-body-emphasis text-decoration-none small"
              title="Release Notes"
              :href="`${manifest.homepage_url}/releases/tag/${manifest.version}`"
              target="_blank"
              rel="nofollow"
            >
              v<span class="version">{{ manifest.version }}</span></a
            >
          </div>
        </div>

        <template v-if="!isMobile">
          <HorizontalRule>Keyboard Shortcuts</HorizontalRule>

          <KeyboardShortcuts />
        </template>

        <HorizontalRule>New Tab Options</HorizontalRule>

        <OptionsForm />

        <PermsCheck :close-window="true" :show-info="true" class="my-3" />

        <CopySupport>Copy Support Information</CopySupport>

        <hr class="mt-0" />

        <PageFooter />
      </div>
      <!-- #options-wrapper -->
    </div>
  </div>

  <ToastAlerts />
  <BackToTop />
</template>

<!--<style scoped></style>-->
