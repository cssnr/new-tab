<script setup lang="ts">
import { openOptions } from '@/utils/extension.ts'

const closeWindow = () => window.close()
</script>

<template>
  <div class="p-1 pt-0">
    <div class="d-flex flex-row justify-content-end gap-2">
      <button title="Options" class="btn btn-sm btn-outline-info hvr-grow-sm" @click="openOptions()">
        <i class="fa-solid fa-gears"></i> Options
      </button>
      <button title="Close" class="btn btn-sm btn-outline-warning hvr-grow-sm" @click="closeWindow()">
        <i class="fa-regular fa-circle-xmark"></i> Close
      </button>
    </div>
  </div>
</template>

<!--<style scoped></style>-->
