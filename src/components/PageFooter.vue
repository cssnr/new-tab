<script setup lang="ts">
import { i18n } from '#imports'
import { clickOpen } from '@/utils/extension.ts'

withDefaults(
  defineProps<{
    homePage?: boolean
    requestFeature?: boolean
    openIssue?: boolean
  }>(),
  {
    homePage: true,
    requestFeature: true,
    openIssue: true,
  },
)

const manifest = chrome.runtime.getManifest()
</script>

<template>
  <div class="text-center">
    <a
      v-if="homePage"
      class="link-body-emphasis text-decoration-none d-inline-block"
      rel="noopener"
      :href="manifest.homepage_url"
      target="_blank"
      @click.prevent="clickOpen"
      >{{ i18n.t('ui.text.homePage') }}</a
    >
    <span class="mx-1">&bull;</span>
    <a
      v-if="requestFeature"
      class="link-body-emphasis text-decoration-none d-inline-block"
      rel="noopener"
      :href="`${manifest.homepage_url}/issues/new?template=1-feature.yaml`"
      target="_blank"
      @click.prevent="clickOpen"
      >{{ i18n.t('ui.text.requestFeature') }}</a
    >
    <span class="mx-1">&bull;</span>
    <a
      v-if="openIssue"
      class="link-body-emphasis text-decoration-none d-inline-block"
      rel="noopener"
      :href="`${manifest.homepage_url}/issues`"
      target="_blank"
      @click.prevent="clickOpen"
      >{{ i18n.t('ui.text.openIssue') }}</a
    >
  </div>
</template>

<!--<style scoped></style>-->
