<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { saveOptions } from '@/utils/options.ts'
import { Tooltip } from 'bootstrap'
import { isMobile } from '@/utils/system.ts'
import { useOptions } from '@/composables/useOptions.ts'

const props = withDefaults(
  defineProps<{
    compact?: boolean
  }>(),
  {
    compact: false,
  },
)

console.debug('%cLOADED: OptionsForm.vue', 'color: Orange', props)

const options = useOptions()

onMounted(() => {
  console.debug('%cMOUNTED: OptionsForm.vue', 'color: Lime')
  // getOptions().then((results) => (options.value = results))

  // NOTE: Find a better way to enable tooltips...
  document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((el) => new Tooltip(el))
})

onUnmounted(() => {
  console.debug('%cUNMOUNTED: OptionsForm.vue', 'color: Yellow')
})
</script>

<template>
  <form>
    <div v-if="!props.compact" class="row mb-2">
      <div class="col-12 col-sm-6 mb-2">
        <label for="maxResults" class="form-label"><i class="fa-solid fa-hashtag me-1"></i> Max History</label>
        <i class="fa-solid fa-circle-info p-1" data-bs-toggle="tooltip" data-bs-title="Maximum Items Processed."></i>
        <input
          v-model="options.maxResults"
          @change="saveOptions"
          id="maxResults"
          aria-describedby="maxResultsHelp"
          class="form-control"
          type="number"
          step="500"
          min="0"
          autocomplete="off"
          placeholder="# of Items"
        />
        <div class="form-text" id="maxResultsHelp">Maximum Items Processed.</div>
      </div>

      <div class="col-12 col-sm-6 mb-2">
        <label for="expandedRows" class="form-label"><i class="fa-solid fa-border-top-left"></i> Expanded Rows</label>
        <i class="fa-solid fa-circle-info p-1" data-bs-toggle="tooltip" data-bs-title="Search Box Expanded Rows."></i>
        <input
          v-model="options.expandedRows"
          @change="saveOptions"
          id="expandedRows"
          aria-describedby="expandedRowsHelp"
          class="form-control"
          type="number"
          step="1"
          min="2"
          autocomplete="off"
          placeholder="# of Rows"
        />
        <div class="form-text" id="expandedRowsHelp">Search Box Expanded Rows.</div>
      </div>

      <div class="col-12 mb-2">
        <label for="bgImage" class="form-label"><i class="fa-regular fa-image me-1"></i> Background Image URL</label>
        <i class="fa-solid fa-circle-info p-1" data-bs-toggle="tooltip" data-bs-title="URL to Background Image."></i>
        <input
          v-model="options.bgImage"
          @change="saveOptions"
          id="bgImage"
          aria-describedby="bgImageHelp"
          class="form-control"
          type="text"
          autocomplete="off"
        />
        <div class="form-text" id="bgImageHelp">New Tab Background Image (blank for none).</div>
      </div>

      <div class="col-12 col-sm-6 mb-2">
        <label for="textRows" class="form-label"><i class="fa-solid fa-grip-lines"></i> Text Rows</label>
        <i class="fa-solid fa-circle-info p-1" data-bs-toggle="tooltip" data-bs-title="Number of Text Rows."></i>
        <input
          v-model="options.textRows"
          @change="saveOptions"
          id="textRows"
          aria-describedby="textRowsHelp"
          class="form-control"
          type="number"
          step="1"
          min="1"
          max="6"
          autocomplete="off"
          placeholder="# of Rows"
        />
        <div class="form-text visually-hidden" id="textRowsHelp">Number of Text Rows.</div>
      </div>

      <div class="col-12 col-sm-6 mb-2">
        <label for="iconSize" class="form-label"><i class="fa-solid fa-icons"></i> Icon Size</label>
        <div class="d-flex align-items-center gap-2">
          <output for="iconSize" class="fw-bold">{{ options.iconSize }}</output>
          <input
            v-model="options.iconSize"
            @change="saveOptions"
            id="iconSize"
            class="form-range flex-grow-1"
            type="range"
            min="32"
            max="96"
            step="2"
          />
        </div>
      </div>

      <div class="col">
        <div class="form-check form-switch">
          <input
            v-model="options.showTopSites"
            @change="saveOptions"
            id="showTopSites"
            class="form-check-input"
            type="checkbox"
            role="switch"
          />
          <label class="form-check-label" for="showTopSites">Show Top Sites</label>
          <i
            class="fa-solid fa-circle-info p-1"
            data-bs-toggle="tooltip"
            data-bs-title="Show Context Menu on Right Click."
          ></i>
        </div>

        <div v-show="options.showTopSites">
          <label for="numTopSites" class="form-label visually-hidden">Number of Top Sites</label>
          <div class="d-flex align-items-center gap-2">
            <output for="numTopSites" class="fw-bold">{{ options.numTopSites }}</output>
            <input
              v-model="options.numTopSites"
              @change="saveOptions"
              id="numTopSites"
              class="form-range flex-grow-1"
              type="range"
              min="1"
              max="12"
            />
          </div>
        </div>

        <div class="d-flex flex-row align-items-center justify-content-center">
          <hr class="w-100 my-0" />
          <span class="text-nowrap mx-2">Extension Options</span>
          <hr class="w-100 my-0" />
        </div>
      </div>
    </div>

    <div v-if="!isMobile" class="form-check form-switch">
      <input
        v-model="options.contextMenu"
        @change="saveOptions"
        id="contextMenu"
        class="form-check-input"
        type="checkbox"
        role="switch"
      />
      <label class="form-check-label" for="contextMenu">Enable Right Click Menu</label>
      <i
        class="fa-solid fa-circle-info p-1"
        data-bs-toggle="tooltip"
        data-bs-title="Show Context Menu on Right Click."
      ></i>
    </div>
    <div class="form-check form-switch">
      <input
        v-model="options.showUpdate"
        @change="saveOptions"
        id="showUpdate"
        class="form-check-input"
        type="checkbox"
        role="switch"
      />
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
