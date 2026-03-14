<script setup lang="ts">
import { openExtPanel, openOptions, openPopup, openSidePanel } from '@/utils/extension.ts'
import { isMobile } from '@/utils/system.ts'

const props = withDefaults(
  defineProps<{
    panelButton?: boolean
    pageButton?: boolean // not implemented
    sideButton?: boolean
    popupButton?: boolean
    optionsButton?: boolean
    closeWindow?: boolean
  }>(),
  {
    panelButton: true,
    pageButton: true,
    sideButton: true,
    popupButton: true,
    optionsButton: true,
    closeWindow: false,
  },
)

const manifest = chrome.runtime.getManifest()
</script>

<template>
  <div class="container-fluid p-2">
    <div class="d-flex flex-row align-items-center text-nowrap">
      <div class="dropdown">
        <a
          class="link-body-emphasis text-decoration-none"
          id="bs-theme-dropdown"
          title="Theme Switcher"
          role="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          href="#"
        >
          <i id="theme-icon" class="fa-solid fa-circle-half-stroke fa-lg" style="min-width: 20px"></i>
          <i class="fa-solid fa-caret-down fa-xs mx-1"></i
        ></a>
        <ul class="dropdown-menu auto dropdown-menu-end" aria-labelledby="bs-theme-dropdown">
          <li>
            <button class="dropdown-item" data-bs-theme-value="dark" aria-pressed="false">
              <i class="fa-regular fa-moon" style="min-width: 16px"></i>
              <span class="ms-3">Dark</span>
            </button>
          </li>
          <li>
            <button class="dropdown-item" data-bs-theme-value="light" aria-pressed="false">
              <i class="fa-solid fa-sun" style="min-width: 16px"></i>
              <span class="ms-3">Light</span>
            </button>
          </li>
          <li>
            <button class="dropdown-item" data-bs-theme-value="auto" aria-pressed="false">
              <i class="fa-solid fa-circle-half-stroke" style="min-width: 16px"></i>
              <span class="ms-3">Auto</span>
            </button>
          </li>
        </ul>
      </div>
      <!-- dropdown -->

      <div class="d-flex flex-grow-1 overflow-hidden align-items-baseline">
        <a
          title="Home Page"
          class="link-body-emphasis text-decoration-none fs-4"
          target="_blank"
          :href="manifest.homepage_url"
        >
          <img src="/images/logo32.png" alt="L" class="mb-1" style="height: 1.1em" />
          {{ manifest.name }}</a
        >
        <a
          title="Release Notes"
          class="link-body-emphasis text-decoration-none small ms-1"
          target="_blank"
          :href="`${manifest.homepage_url}/releases/tag/${manifest.version}`"
        >
          v<span class="version">{{ manifest.version }}</span></a
        >
      </div>
      <!-- flex-grow-1 -->

      <div v-if="!isMobile && props.panelButton" class="ms-1">
        <button title="Extension Panel" class="btn btn-sm btn-outline-info" @click="openExtPanel(props.closeWindow)">
          <i class="fa-regular fa-window-restore me-1"></i>
        </button>
      </div>

      <div v-if="!isMobile && props.sideButton" class="ms-1">
        <button title="Side Panel" class="btn btn-sm btn-outline-info" @click="openSidePanel(props.closeWindow)">
          <i class="fa-solid fa-table-columns"></i>
        </button>
      </div>

      <div v-if="!isMobile && props.popupButton" class="ms-1">
        <button title="Open Popup" class="btn btn-sm btn-outline-info" @click="openPopup()">
          <i class="fa-solid fa-window-maximize"></i>
        </button>
      </div>

      <div v-if="props.optionsButton" class="ms-1">
        <a
          title="Options"
          class="btn btn-sm btn-outline-info"
          role="button"
          href="options.html"
          target="_blank"
          @click.prevent="openOptions(props.closeWindow)"
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
