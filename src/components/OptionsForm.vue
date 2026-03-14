<script setup lang="ts">
import { onMounted } from 'vue'
import { saveOptions, updateOptions } from '@/utils/options.ts'
import { Tooltip } from 'bootstrap'
import { isMobile } from '@/utils/system.ts'
// import OptionTable from '@/components/OptionTable.vue'

const props = withDefaults(
  defineProps<{
    compact?: boolean
  }>(),
  {
    compact: false,
  },
)

chrome.storage.onChanged.addListener(onChanged)

function onChanged(changes: object, namespace: string) {
  for (const [key, _] of Object.entries(changes)) {
    console.debug('onChanged:', namespace, key)
    if (namespace === 'sync' && key === 'options') {
      updateOptions()
    }
  }
}

onMounted(() => {
  updateOptions()
  // NOTE: Find a better way to enable tooltips...
  document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((el) => new Tooltip(el))
})
</script>

<template>
  <form>
    <div v-if="!props.compact" class="row mb-2">
      <div class="col-12 col-sm-8 mb-2">
        <label for="testInput" class="form-label"><i class="fa-regular fa-keyboard me-1"></i> Test Input</label>
        <i class="fa-solid fa-circle-info p-1" data-bs-toggle="tooltip" data-bs-title="Example Text Input."></i>
        <input
          id="testInput"
          aria-describedby="testInputHelp"
          type="text"
          class="form-control"
          autocomplete="off"
          @change="saveOptions"
        />
        <div class="form-text" id="testInputHelp">Just a test text input.</div>
      </div>
      <div class="col-12 col-sm-4 mb-2">
        <label for="maxResults" class="form-label"><i class="fa-solid fa-hashtag me-1"></i> Max History</label>
        <i class="fa-solid fa-circle-info p-1" data-bs-toggle="tooltip" data-bs-title="Max History to Search."></i>
        <input
          id="maxResults"
          aria-describedby="maxResultsHelp"
          type="number"
          step="500"
          min="0"
          class="form-control"
          autocomplete="off"
          placeholder="Minutes"
          @change="saveOptions"
        />
        <div class="form-text" id="maxResultsHelp">Max Items Processed.</div>
      </div>
    </div>

    <div v-if="!isMobile" class="form-check form-switch">
      <input class="form-check-input" id="contextMenu" type="checkbox" role="switch" @change="saveOptions" />
      <label class="form-check-label" for="contextMenu">Enable Right Click Menu</label>
      <i
        class="fa-solid fa-circle-info p-1"
        data-bs-toggle="tooltip"
        data-bs-title="Show Context Menu on Right Click."
      ></i>
    </div>
    <div class="form-check form-switch">
      <input class="form-check-input" id="showUpdate" type="checkbox" role="switch" @change="saveOptions" />
      <label class="form-check-label" for="showUpdate">Show Release Notes on Update</label>
      <i
        class="fa-solid fa-circle-info p-1"
        data-bs-toggle="tooltip"
        data-bs-title="Show Release Notes on Version Update."
      ></i>
    </div>

    <div>
      <!--<OptionTable />-->
    </div>
  </form>
</template>

<!--<style scoped></style>-->
