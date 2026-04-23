<script setup lang="ts">
import { i18n } from '#imports'
import { ref, watch } from 'vue'
import { useOptions } from '@/composables/useOptions.ts'
import { saveKeyValue } from '@/utils/options.ts'
import HorizontalRule from '@/components/HorizontalRule.vue'
import ImageManager from '@/components/ImageManager.vue'

const options = useOptions()

const bgRef = ref<RadioBackground>('bgNone')
const pictureURL = ref('')
const videoURL = ref('')

watch(
  options,
  (opts) => {
    console.log('%cBackgroundForm.vue watch - options:', 'color: GreenYellow', opts)
    bgRef.value = options.value.radioBackground
    pictureURL.value = options.value.pictureURL
    videoURL.value = options.value.videoURL
  },
  { deep: true },
)

const radios = [
  { id: 'bgNone', fa: 'fa-regular fa-square', text: i18n.t('background.none') },
  { id: 'bgPicture', fa: 'fa-regular fa-image', text: i18n.t('background.picture') },
  { id: 'bgVideo', fa: 'fa-solid  fa-video', text: i18n.t('background.video') },
  { id: 'bgLocal', fa: 'fa-regular fa-floppy-disk', text: i18n.t('background.local') },
]

// NOTE: This was ported from VanillaJS and may need refactoring
</script>

<template>
  <div>
    <HorizontalRule>New Tab Background</HorizontalRule>
    <form @change="saveKeyValue('radioBackground', bgRef)">
      <div class="d-flex flex-column flex-md-row ms-1 ms-md-3">
        <div v-for="radio of radios" class="form-check form-check-inline mb-2 mb-md-0">
          <input
            v-model="bgRef"
            class="form-check-input"
            type="radio"
            name="radioBackground"
            :id="radio.id"
            :value="radio.id"
          />
          <label class="form-check-label" :for="radio.id"> <i :class="radio.fa"></i> {{ radio.text }} </label>
        </div>
      </div>
    </form>

    <div class="ms-0 ms-md-3">
      <div v-if="bgRef === 'bgPicture'" id="bgPictureInput" class="input-group">
        <span
          class="input-group-text"
          id="picture-addon"
          data-bs-toggle="tooltip"
          :data-bs-title="i18n.t('background.pictureTip')"
          v-bs
        >
          <i class="fa-solid fa-circle-info"></i
        ></span>
        <input
          v-model="pictureURL"
          type="text"
          class="form-control"
          :placeholder="i18n.t('background.pictureLabel')"
          :aria-label="i18n.t('background.pictureLabel')"
          id="pictureURL"
          name="pictureURL"
          aria-describedby="picture-addon"
          @change="saveKeyValue('pictureURL', pictureURL)"
        />
      </div>
      <div v-if="bgRef === 'bgVideo'" id="bgVideoInput" class="input-group">
        <span
          class="input-group-text"
          id="video-addon"
          data-bs-toggle="tooltip"
          :data-bs-title="i18n.t('background.videoTip')"
          v-bs
        >
          <i class="fa-solid fa-circle-info"></i
        ></span>
        <input
          v-model="videoURL"
          type="text"
          class="form-control"
          :placeholder="i18n.t('background.videoLabel')"
          :aria-label="i18n.t('background.videoLabel')"
          id="videoURL"
          name="videoURL"
          aria-describedby="video-addon"
          @change="saveKeyValue('videoURL', videoURL)"
        />
      </div>
    </div>

    <ImageManager v-if="bgRef === 'bgLocal'" />
  </div>
</template>
