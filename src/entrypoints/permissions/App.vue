<script setup lang="ts">
import { i18n } from '#imports'
import { onMounted, onUnmounted } from 'vue'
import { openOptions } from '@/utils/extension.ts'
import { useTitle } from '@/composables/useTitle.ts'
import BackToTop from '@/components/BackToTop.vue'
import PermsCheck from '@/components/PermsCheck.vue'
import ToastAlerts from '@/components/ToastAlerts.vue'
import PageFooter from '@/components/PageFooter.vue'

console.debug('%cLOADED permissions/App.vue', 'color: Orange')

useTitle(i18n.t('permissions.title'))

const manifest = chrome.runtime.getManifest()

async function onAdded(permissions: chrome.permissions.Permissions) {
  console.debug('onAdded:', permissions)
  if (document.hasFocus()) {
    await chrome.runtime.openOptionsPage()
    window.close()
  }
}

onMounted(() => chrome.permissions.onAdded.addListener(onAdded))
onUnmounted(() => chrome.permissions.onAdded.removeListener(onAdded))
</script>

<template>
  <div class="container-fluid p-3 h-100">
    <div class="d-flex align-items-center h-100">
      <div class="col-xl-6 col-md-8 col-12 m-auto">
        <div class="card p-3 text-center">
          <div class="d-flex justify-content-center align-items-center">
            <img
              src="@/assets/icon.svg"
              class="me-2"
              height="48"
              width="48"
              :alt="manifest.name"
              :title="manifest.name"
            />
            <h1>{{ manifest.name }}</h1>
          </div>

          <PermsCheck :show-alert="true" class="my-2" />

          <p>{{ i18n.t('permissions.reason') }}</p>
          <a class="btn btn-lg btn-outline-info w-100 mb-3" href="/options.html" @click.prevent="openOptions()">
            <i class="fa-solid fa-sliders me-1"></i> {{ i18n.t('ctx.openOptions') }}</a
          >

          <hr class="mt-0" />

          <PageFooter />
        </div>
      </div>
    </div>
  </div>

  <ToastAlerts />
  <BackToTop />
</template>

<!--<style scoped></style>-->
