<script setup lang="ts">
import { saveOptions } from '@/utils/options.ts'
import { useOptions } from '@/composables/useOptions.ts'
import FormSwitch from '@/components/FormSwitch.vue'
import HorizontalRule from '@/components/HorizontalRule.vue'
import BackgroundForm from '@/components/BackgroundForm.vue'

const props = withDefaults(
  defineProps<{
    show?: string[]
    switches?: string[]
  }>(),
  {
    show: () => ['newtab', 'switches'],
    switches: () => ['contextMenu', 'showUpdate'],
  },
)

console.debug('%cLOADED: OptionsForm.vue', 'color: Orange', props)

const options = useOptions()
</script>

<template>
  <form>
    <div v-if="show.includes('newtab')" class="row mb-2">
      <div class="col-12 col-sm-6 mb-2">
        <label for="maxResults" class="form-label"><i class="fa-solid fa-hashtag me-1"></i> Max History</label>
        <i
          class="fa-solid fa-circle-info p-1"
          data-bs-toggle="tooltip"
          data-bs-title="Maximum Items Processed."
          v-bs
        ></i>
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
        <i
          class="fa-solid fa-circle-info p-1"
          data-bs-toggle="tooltip"
          data-bs-title="Search Box Expanded Rows."
          v-bs
        ></i>
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

      <BackgroundForm />

      <div class="col-12 col-sm-6 mb-2">
        <label for="textRows" class="form-label"><i class="fa-solid fa-grip-lines"></i> Text Rows</label>
        <i class="fa-solid fa-circle-info p-1" data-bs-toggle="tooltip" data-bs-title="Number of Text Rows." v-bs></i>
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
        <i class="fa-solid fa-circle-info p-1" data-bs-toggle="tooltip" data-bs-title="Number of Text Rows." v-bs></i>
        <div class="d-flex align-items-center gap-2">
          <output for="iconSize" class="fw-bold">{{ options.iconSize }}</output>
          <input
            v-model="options.iconSize"
            @change="saveOptions"
            id="iconSize"
            aria-describedby="iconSizeHelp"
            class="form-range flex-grow-1"
            type="range"
            min="32"
            max="96"
            step="2"
          />
        </div>
        <div class="form-text visually-hidden" id="iconSizeHelp">Number of Text Rows.</div>
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
            v-bs
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

        <HorizontalRule>Extension Options</HorizontalRule>
      </div>
    </div>

    <template v-if="show.includes('switches')" v-for="id in switches" :key="id">
      <FormSwitch :id="id" v-model="options[id]" />
    </template>

    <div>
      <!--<OptionTable />-->
    </div>
  </form>
</template>

<!--<style scoped></style>-->
