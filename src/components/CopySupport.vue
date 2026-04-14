<script setup lang="ts">
import { isFirefox, isMobile } from '@/utils/system.ts'
import { getOptions } from '@/utils/options.ts'
import { showToast } from '@/composables/useToast.ts'

const props = withDefaults(
  defineProps<{
    message?: string
    tip?: string
  }>(),
  {
    message: 'Support Information Copied.',
    tip: 'For Issue Reporting',
  },
)

async function copySupport(event: Event) {
  console.debug('copySupport:', event)
  event.preventDefault()
  const date = new Date()
  const manifest = chrome.runtime.getManifest()
  const permissions = await chrome.permissions.getAll()
  const userSettings = await chrome.action.getUserSettings()
  const options = await getOptions()
  const local = await chrome.storage.local.get()

  options.bgImage = options.bgImage ? 'SET' : 'NOT SET'
  // delete local.results

  const result = [
    `${manifest.name} - ${manifest.version}`,
    date.toString(),
    navigator.userAgent,
    `permissions.origins: ${JSON.stringify(permissions.origins)}`,
    `options: ${JSON.stringify(options)}`,
    `local: ${JSON.stringify(local)}`,
    `language: ${chrome.i18n.getUILanguage()}`,
    `pinned: ${userSettings.isOnToolbar}`,
    `isFirefox: ${isFirefox}`,
    `isMobile: ${isMobile}`,
  ]

  const commands = await chrome.commands?.getAll()
  if (commands) result.push(`commands: ${JSON.stringify(commands)}`)
  await navigator.clipboard.writeText(result.join('\n'))
  showToast(props.message)
}
</script>

<template>
  <p>
    <a id="copy-support" href="#" @click.prevent="copySupport"><slot /></a>
    <i v-if="!isMobile" class="fa-solid fa-circle-info ms-2" data-bs-toggle="tooltip" :data-bs-title="tip" v-bs></i>
  </p>
</template>

<!--<style scoped></style>-->
