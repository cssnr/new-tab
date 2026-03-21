<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useToast } from '@/composables/useToast.ts'
import { clickOpen } from '@/utils/extension.ts'
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

const manifest = chrome.runtime.getManifest()
console.debug('host_permissions:', manifest.host_permissions)

async function updatePerms() {
  hasPerms.value = await chrome.permissions.contains({
    origins: manifest.host_permissions,
  })
  console.debug('updatePerms:', hasPerms.value)
}

async function grantPerms(event: Event) {
  console.debug('grantPerms:', event)
  // noinspection ES6MissingAwait
  requestPerms()
  if (props.closeWindow) {
    window.close()
  }
}

async function revokePerms(event: Event) {
  console.debug('revokePerms:', event)
  const permissions = await chrome.permissions.getAll()
  console.debug('permissions:', permissions)
  try {
    await chrome.permissions.remove({
      origins: permissions.origins,
    })
    await updatePerms()
  } catch (e) {
    console.debug(e)
    if (e instanceof Error) showToast(e.toString(), 'danger')
  }
}

async function requestPerms() {
  return await chrome.permissions.request({
    origins: manifest.host_permissions,
  })
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
  <div>
    <div v-if="!hasPerms" class="text-center d-grid gap-2">
      <button
        class="btn btn-lg btn-success"
        type="button"
        data-bs-toggle="tooltip"
        data-bs-placement="top"
        data-bs-trigger="hover"
        data-bs-title="This Extension Requires Host Permissions to Function."
        @click="grantPerms"
      >
        <i class="fa-solid fa-check-double me-1"></i> Grant Host Permissions
      </button>
      <p v-if="showInfo" class="text-center mb-0">
        <a href="/permissions.html" target="_blank" @click.prevent="clickOpen($event, closeWindow)"
          >More Information on Permissions</a
        >
      </p>
    </div>

    <div v-if="hasPerms && showAlert" class="alert alert-success mt-3 mb-0" role="alert">Permissions Granted.</div>

    <div v-if="hasPerms && showRemove && isFirefox">
      <button
        class="btn btn-link link-danger revoke-permissions"
        type="button"
        data-bs-toggle="tooltip"
        data-bs-placement="top"
        data-bs-trigger="hover"
        data-bs-title="Google Chrome does not allow removing required permissions via this method."
        @click="revokePerms"
      >
        Remove Host Permissions
      </button>
    </div>
  </div>
</template>

<!--<style scoped></style>-->
