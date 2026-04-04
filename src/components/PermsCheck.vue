<script setup lang="ts">
import { i18n } from '#imports'
import { ref, onMounted, onUnmounted } from 'vue'
import { useToast } from '@/composables/useToast.ts'
import { clickOpen, hasPermissions } from '@/utils/extension.ts'
import { isFirefox } from '@/utils/system.ts'

const { showToast } = useToast()

const props = withDefaults(
  defineProps<{
    closeWindow?: boolean
    showAlert?: boolean
    showInfo?: boolean
    showRemove?: boolean
  }>(),
  {
    closeWindow: false,
    showAlert: false,
    showInfo: false,
    showRemove: false,
  },
)

const hasPerms = ref(true)

async function updatePerms() {
  hasPerms.value = await hasPermissions()
  console.debug('updatePerms:', hasPerms.value)
}

async function grantPerms(event: Event) {
  console.debug('grantPerms:', event)
  requestPerms().catch(console.log)
  if (props.closeWindow) window.close()
}

async function revokePerms(event: Event) {
  console.debug('revokePerms:', event)
  const permissions = await chrome.permissions.getAll()
  console.debug('permissions:', permissions)
  try {
    await chrome.permissions.remove({ origins: permissions.origins })
    await updatePerms()
  } catch (e) {
    console.debug(e)
    if (e instanceof Error) showToast(e.toString(), 'danger')
  }
}

async function requestPerms() {
  // NOTE: This should be a reusable function in utils/extension.ts
  const manifest = chrome.runtime.getManifest()
  return await chrome.permissions.request({ origins: manifest.host_permissions })
}

onMounted(() => {
  updatePerms()
  chrome.permissions.onAdded.addListener(updatePerms)
  chrome.permissions.onRemoved.addListener(updatePerms)
})

onUnmounted(() => {
  chrome.permissions.onAdded.removeListener(updatePerms)
  chrome.permissions.onRemoved.removeListener(updatePerms)
})
</script>

<template>
  <div v-if="!hasPerms || showAlert || showRemove">
    <div v-if="!hasPerms" class="text-center d-grid gap-2">
      <button
        class="btn btn-lg btn-success"
        type="button"
        data-bs-toggle="tooltip"
        data-bs-placement="top"
        data-bs-trigger="hover"
        :data-bs-title="i18n.t('perms.grant.tip')"
        @click="grantPerms"
        v-bs
      >
        <i class="fa-solid fa-check-double me-1"></i> {{ i18n.t('perms.grant.text') }}
      </button>
      <p v-if="showInfo" class="text-center mb-0">
        <a href="/permissions.html" target="_blank" @click.prevent="clickOpen($event, closeWindow)">{{
          i18n.t('perms.info')
        }}</a>
      </p>
    </div>

    <div v-if="hasPerms && showAlert" class="alert alert-success mt-3 mb-0" role="alert">
      {{ i18n.t('perms.granted') }}
    </div>

    <div v-if="hasPerms && showRemove && isFirefox">
      <button
        class="btn btn-link link-danger revoke-permissions"
        type="button"
        data-bs-toggle="tooltip"
        data-bs-placement="top"
        data-bs-trigger="hover"
        :data-bs-title="i18n.t('perms.remove.tip')"
        @click="revokePerms"
        v-bs
      >
        {{ i18n.t('perms.remove.text') }}
      </button>
    </div>
  </div>
</template>

<!--<style scoped></style>-->
