<script setup lang="ts">
import { isMobile } from '@/utils/system.ts'
import { showToast } from '@/composables/useToast.ts'
import { openExtPanel, openOptions, openPage, openPopup, openSidePanel } from '@/utils/extension.ts'

const props = withDefaults(
  defineProps<{
    toastButton?: boolean
    panelButton?: boolean
    pageButton?: boolean
    sideButton?: boolean
    popupButton?: boolean
    optionsButton?: boolean
    closeWindow?: boolean
  }>(),
  {
    toastButton: true,
    panelButton: true,
    pageButton: true,
    sideButton: true,
    popupButton: true,
    optionsButton: true,
    closeWindow: false,
  },
)
console.log('closeWindow:', props.closeWindow)
</script>

<template>
  <div>
    <div class="d-grid gap-1 mb-2">
      <a
        v-if="props.toastButton"
        class="btn btn-secondary d-flex align-items-center hvr-grow-sm"
        @click="showToast('ti ekorb flar')"
      >
        <i class="fa-regular fa-window-maximize me-1"></i>
        <span class="flex-fill text-center me-4">Show Factual Toast</span>
      </a>

      <a
        v-if="!isMobile && props.pageButton"
        class="btn btn-primary d-flex align-items-center hvr-grow-sm"
        role="button"
        href="page.html"
        target="_blank"
        @click.prevent="openPage(props.closeWindow)"
      >
        <i class="fa-solid fa-desktop me-1"></i>
        <span class="flex-fill text-center me-4">Open Extension Page</span>
      </a>

      <button
        v-if="!isMobile && props.popupButton"
        class="btn btn-success d-flex align-items-center hvr-grow-sm"
        @click="openPopup()"
      >
        <i class="fa-solid fa-window-maximize me-1"></i>
        <span class="flex-fill text-center me-4">Open Popup</span>
      </button>

      <button
        v-if="!isMobile && props.panelButton"
        class="btn btn-danger d-flex align-items-center hvr-grow-sm"
        @click="openExtPanel(props.closeWindow)"
      >
        <i class="fa-regular fa-window-restore me-1"></i>
        <span class="flex-fill text-center me-4">Open Extension Panel</span>
      </button>

      <button
        v-if="!isMobile && props.sideButton"
        class="btn btn-warning d-flex align-items-center hvr-grow-sm"
        @click="openSidePanel(props.closeWindow)"
      >
        <i class="fa-solid fa-table-columns me-1"></i>
        <span class="flex-fill text-center me-4">Open Side Panel</span>
      </button>

      <a
        v-if="!isMobile && props.optionsButton"
        class="btn btn-info d-flex align-items-center hvr-grow-sm"
        role="button"
        href="options.html"
        target="_blank"
        @click.prevent="openOptions(props.closeWindow)"
      >
        <i class="fa-solid fa-gears me-1"></i>
        <span class="flex-fill text-center me-4">Open Options</span>
      </a>
    </div>
  </div>
</template>
