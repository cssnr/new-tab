<script setup lang="ts">
import { i18n } from '#imports'
import { clickOpen, openExtPanel, openOptions, openPage, openPopup, openSidePanel } from '@/utils/extension.ts'
import { isMobile } from '@/utils/system.ts'
import ThemeSwitch from '@/components/ThemeSwitch.vue'

withDefaults(
  defineProps<{
    panelButton?: boolean
    pageButton?: boolean
    sideButton?: boolean
    popupButton?: boolean
    optionsButton?: boolean
    closeWindow?: boolean
  }>(),
  {
    panelButton: true,
    pageButton: false,
    sideButton: true,
    popupButton: true,
    optionsButton: true,
    closeWindow: false,
  },
)

const manifest = chrome.runtime.getManifest()
console.log('manifest:', manifest)
</script>

<template>
  <div class="container-fluid p-2">
    <div class="d-flex flex-row align-items-center text-nowrap">
      <ThemeSwitch />

      <div class="d-flex flex-grow-1 overflow-hidden align-items-baseline">
        <a
          :title="i18n.t('ui.text.homePage')"
          class="link-body-emphasis text-decoration-none fs-4"
          :href="manifest.homepage_url"
          target="_blank"
          @click.prevent="clickOpen($event, closeWindow)"
        >
          <img :src="'/icons/32.png'" alt="L" class="mb-1" style="height: 1.1em" />
          {{ manifest.name }}</a
        >
        <a
          :title="i18n.t('ui.text.releaseNotes')"
          class="link-body-emphasis text-decoration-none small ms-1"
          :href="`${manifest.homepage_url}/releases/tag/${manifest.version}`"
          target="_blank"
          @click.prevent="clickOpen($event, closeWindow)"
        >
          v<span class="version">{{ manifest.version }}</span></a
        >
      </div>

      <div v-if="pageButton" class="ms-1">
        <a
          :title="i18n.t('ui.action.extensionPage')"
          href="/page.html"
          class="btn btn-sm btn-outline-info"
          @click.prevent="openPage(closeWindow)"
        >
          <i class="fa-solid fa-display me-1"></i>
        </a>
      </div>

      <div v-if="!isMobile && panelButton" class="ms-1">
        <button
          :title="i18n.t('ui.action.extensionPanel')"
          class="btn btn-sm btn-outline-info"
          @click="openExtPanel(closeWindow)"
        >
          <i class="fa-regular fa-window-restore me-1"></i>
        </button>
      </div>

      <div v-if="!isMobile && sideButton" class="ms-1">
        <button
          :title="i18n.t('ui.action.sidePanel')"
          class="btn btn-sm btn-outline-info"
          @click="openSidePanel(closeWindow)"
        >
          <i class="fa-solid fa-table-columns"></i>
        </button>
      </div>

      <div v-if="!isMobile && popupButton" class="ms-1">
        <button :title="i18n.t('ui.action.openPopup')" class="btn btn-sm btn-outline-info" @click="openPopup()">
          <i class="fa-solid fa-window-maximize"></i>
        </button>
      </div>

      <div v-if="optionsButton" class="ms-1">
        <a
          :title="i18n.t('ui.action.options')"
          href="/options.html"
          class="btn btn-sm btn-outline-info"
          @click.prevent="openOptions(closeWindow)"
        >
          <i class="fa-solid fa-gears"></i
        ></a>
      </div>
    </div>
  </div>
  <!-- container-fluid -->

  <hr class="my-0" />
</template>

<!--<style scoped></style>-->
