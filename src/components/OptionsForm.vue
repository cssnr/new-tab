<script setup lang="ts">
import { provide, ref } from 'vue'
import { saveKeyValue, saveOptions } from '@/utils/options.ts'
import { useOptions } from '@/composables/useOptions.ts'
import FormInput from '@/components/FormInput.vue'
import FormSwitch from '@/components/FormSwitch.vue'
import HorizontalRule from '@/components/HorizontalRule.vue'
import BackgroundForm from '@/components/BackgroundForm.vue'
import BookmarksForm from '@/components/BookmarksForm.vue'

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
provide('options', options)

const githubUrlValid = ref(true)

function urlChange(id: string, value: string) {
  console.log('urlChange:', id, value)
  try {
    if (!value.includes('://')) value = `https://${value}`
    const url = new URL(value)
    console.log('VALID:', 'color: Lime', url.origin)
    options.value.githubUrl = url.origin
    githubUrlValid.value = true
    saveKeyValue(id, url.origin)
  } catch (e) {
    console.log('INVALID:', 'color: Orange', value)
    githubUrlValid.value = false
  }
}
</script>

<template>
  <form>
    <div v-if="show.includes('newtab')" class="row mb-2">
      <FormSwitch
        v-model="options.showSearch"
        id="showSearch"
        label="Show Search Box"
        tooltip="Show Search Box on New Tab Page."
      />
      <template v-if="options.showSearch">
        <FormInput
          class="col-12 col-sm-6 mb-2"
          v-model="options.maxResults"
          id="maxResults"
          label="Max History"
          placeholder="# of Items"
          tooltip="Maximum Items Processed"
          fa="fa-solid fa-hashtag"
          type="number"
          step="500"
          min="0"
        />
        <FormInput
          class="col-12 col-sm-6 mb-2"
          v-model="options.expandedRows"
          id="expandedRows"
          label="Expand Rows"
          placeholder="# of Items"
          tooltip="Search Box Expanded Rows"
          fa="fa-solid fa-border-top-left"
          type="number"
          step="1"
          min="2"
        />
      </template>

      <div class="col-12">
        <FormSwitch
          v-model="options.showTopSites"
          id="showTopSites"
          label="Show Top Sites"
          tooltip="Show Top Sites on New Tab Page."
        />
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
      </div>

      <div class="col-12">
        <!--NOTE: Add Fallthrough Attributes to BookmarksForm-->
        <BookmarksForm />
      </div>

      <FormInput
        class="col-12 col-sm-6 mb-2"
        v-model="options.textRows"
        id="textRows"
        label="Text Rows"
        placeholder="# of Items"
        tooltip="Number of Text Rows"
        fa="fa-solid fa-grip-lines"
        type="number"
        step="1"
        min="1"
        max="6"
      />
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

      <FormInput
        class="col-12"
        v-model="options.newTabTitle"
        id="newTabTitle"
        label="New Tab Title"
        placeholder="# of Items"
        tooltip="Title of the New Tab page"
        fa="fa-solid fa-t"
      />

      <div class="col-12">
        <label for="githubUrl" class="form-label"><i class="fa-brands fa-github me-1"></i> GitHub URL</label>
        <i class="fa-solid fa-circle-info p-1" data-bs-toggle="tooltip" data-bs-title="Custom GitHub URL." v-bs></i>
        <input
          v-model="options.githubUrl"
          @change="urlChange('githubUrl', options.githubUrl)"
          id="githubUrl"
          aria-describedby="githubUrlHelp"
          class="form-control"
          :class="{ 'is-invalid': !githubUrlValid }"
          type="text"
          autocomplete="off"
          placeholder="https://github.com"
        />
        <div class="form-text visually-hidden" id="githubUrlHelp">Custom GitHub URL.</div>
        <div class="invalid-feedback">Invalid URL</div>
      </div>

      <BackgroundForm class="col-12" />
    </div>

    <HorizontalRule>Extension Options</HorizontalRule>
    <template v-if="show.includes('switches')" v-for="id in switches" :key="id">
      <FormSwitch :id="id" v-model="options[id]" />
    </template>
  </form>
</template>
