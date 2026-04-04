<script setup lang="ts">
import { ref } from 'vue'
import { useOptions } from '@/composables/useOptions.ts'
import { saveKeyValue } from '@/utils/options.ts'

const options = useOptions()

const bgRef = ref<'bgNone' | 'bgPicture' | 'bgVideo'>('bgNone')

const pictureURL = ref('')
const videoURL = ref('')

watch(
  options,
  (opts) => {
    console.log('BackgroundForm.vue %c watch: options:', 'color: OrangeRed', opts)
    bgRef.value = options.value.radioBackground
    pictureURL.value = options.value.pictureURL
    videoURL.value = options.value.videoURL
  },
  { deep: true },
)

function radioChange(event: Event) {
  console.log('radioChange', event)
  console.log('bgRef', bgRef.value)
  saveKeyValue('radioBackground', bgRef.value)
}
</script>

<template>
  <div>
    <form @change="radioChange">
      <div class="d-flex flex-column flex-sm-row">
        <div class="form-check form-check-inline mb-2 mb-sm-0">
          <input
            v-model="bgRef"
            class="form-check-input"
            type="radio"
            name="radioBackground"
            id="bgNone"
            value="bgNone"
          />
          <label class="form-check-label" for="bgNone">
            <i class="fa-regular fa-square"></i> {{ i18n.t('background.none') }}
          </label>
        </div>

        <div class="form-check form-check-inline mb-2 mb-sm-0">
          <input
            v-model="bgRef"
            class="form-check-input"
            type="radio"
            name="radioBackground"
            id="bgPicture"
            value="bgPicture"
          />
          <label class="form-check-label" for="bgPicture">
            <i class="fa-regular fa-image"></i> {{ i18n.t('background.picture') }}
          </label>
        </div>

        <div class="form-check form-check-inline mb-2">
          <input
            v-model="bgRef"
            class="form-check-input"
            type="radio"
            name="radioBackground"
            id="bgVideo"
            value="bgVideo"
          />
          <label class="form-check-label" for="bgVideo">
            <i class="fa-solid fa-video"></i> {{ i18n.t('background.video') }}
          </label>
        </div>
      </div>
    </form>

    <div class="">
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
  </div>
</template>

<!--<style scoped></style>-->
