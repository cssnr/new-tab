<script setup lang="ts">
const props = withDefaults(
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
console.debug('manifest:', manifest)
</script>

<template>
  <div class="text-center">
    <a
      v-if="props.homePage"
      class="link-body-emphasis text-decoration-none d-inline-block"
      target="_blank"
      rel="noopener"
      :href="manifest.homepage_url"
      >Home Page</a
    >
    <span class="mx-1">&bull;</span>
    <a
      v-if="props.requestFeature"
      class="link-body-emphasis text-decoration-none d-inline-block"
      target="_blank"
      rel="noopener"
      :href="`${manifest.homepage_url}/issues/new?template=1-feature.yaml`"
      >Request Feature</a
    >
    <span class="mx-1">&bull;</span>
    <a
      v-if="props.openIssue"
      class="link-body-emphasis text-decoration-none d-inline-block"
      target="_blank"
      rel="noopener"
      :href="`${manifest.homepage_url}/issues`"
      >Open Issue</a
    >
  </div>
</template>

<!--<style scoped></style>-->
