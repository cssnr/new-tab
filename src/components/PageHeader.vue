<script setup lang="ts">
import { i18n } from '#imports'
import { clickOpen } from '@/utils/extension.ts'

// const config = useAppConfig()
// console.log('config:', config)
const manifest = chrome.runtime.getManifest()
console.log('manifest:', manifest)
</script>

<template>
  <div class="d-flex flex-row justify-content-center align-items-center">
    <img src="@/assets/icon.svg" class="me-1" height="48" width="48" :alt="manifest.name" :title="manifest.name" />
    <div>
      <a
        class="link-body-emphasis text-decoration-none fs-1"
        :title="i18n.t('ui.text.homePage')"
        :href="manifest.homepage_url"
        target="_blank"
        rel="nofollow"
        @click.prevent="clickOpen"
      >
        {{ manifest.name }}</a
      >
      <a
        class="link-body-emphasis text-decoration-none small"
        :title="i18n.t('ui.text.releaseNotes')"
        :href="`${manifest.homepage_url}/releases/tag/${manifest.version}`"
        target="_blank"
        rel="nofollow"
        @click.prevent="clickOpen"
      >
        v<span class="version">{{ manifest.version }}</span></a
      >
    </div>
  </div>
</template>
