<script setup lang="ts">
import { i18n } from '#imports'
import { onMounted, onUnmounted, provide, ref, watch } from 'vue'
import { useBackground } from '@/composables/useBackground.ts'
import { useOptions } from '@/composables/useOptions.ts'
import { useBookmarks } from '@/composables/useBookmarks.ts'
import type { Options } from '@/utils/options.ts'
import GitHubRepos from '@/components/GitHubRepos.vue'
import SearchBox from '@/components/SearchBox.vue'
import ToastAlerts from '@/components/ToastAlerts.vue'
import TopSites from '@/components/TopSites.vue'
import OptionsOffscreen from '@/components/OptionsOffscreen.vue'
import BookmarksFolder from '@/components/BookmarksFolder.vue'
import GitHubIssues from '@/components/GitHubIssues.vue'

console.debug('%cLOADED: newtab/App.vue', 'color: Orange')

useBackground()

const options = useOptions()

const bookmarks = useBookmarks()
provide('bookmarks', bookmarks)

const githubSearch = ref<InstanceType<typeof GitHubRepos> | null>(null)

const setTitle = (opts: Options) => (document.title = opts.newTabTitle || i18n.t('newtab.title'))

watch(options, setTitle, { once: true })

function handleKeyboard(e: KeyboardEvent) {
  if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || e.repeat) return

  const target = e.target as HTMLInputElement
  if (['INPUT', 'TEXTAREA', 'SELECT', 'OPTION'].includes(target?.tagName)) return
  if (e.key.length !== 1 && e.key !== 'Backspace') return

  console.log(`handleKeyboard: ${e.code} "${e.key}" - ${e.key.length}`)
  githubSearch.value?.focusSearch(e.key)
}

onMounted(async () => {
  console.debug('%cMOUNTED: newtab/App.vue', 'color: Lime')
  window.addEventListener('keydown', handleKeyboard)
})

onUnmounted(() => {
  console.debug('%cUNMOUNTED: newtab/App.vue', 'color: Yellow')
  window.removeEventListener('keydown', handleKeyboard)
})
</script>

<template>
  <header class="flex-shrink-0">
    <SearchBox v-if="options.showSearch" class="m-2" :expanded-rows="options.expandedRows" />

    <BookmarksFolder
      :num-items="options.numBookmarks"
      :text-rows="options.textRows"
      :size="options.iconSize"
      class="m-2"
    />

    <TopSites
      v-if="options?.showTopSites"
      :num-items="options.numTopSites"
      :text-rows="options.textRows"
      :size="options.iconSize"
      class="m-2"
    />
  </header>

  <main class="flex-grow-1 overflow-auto d-flex flex-column p-1">
    <div :style="{ height: options.githubToken ? `35% !important` : '100% !important' }">
      <!--TODO: Cleanup all these nested classes and move to GitHubRepos-->
      <div class="d-flex align-items-center justify-content-center w-100 h-100 pb-3 pe-3">
        <div class="glass-outline rounded rounded-3 my-0 mx-auto w-100 h-100 d-flex flex-column">
          <div class="p-1 flex-grow-1 overflow-auto">
            <GitHubRepos v-if="options.githubUrl" ref="githubSearch" :github-url="options.githubUrl" />
          </div>
        </div>
      </div>
    </div>

    <!--TODO: Implement scrolling on table and remove overflow-auto-->
    <div v-if="options.githubToken" class="d-flex flex-column overflow-hidden" style="height: 65% !important">
      <GitHubIssues />
    </div>
  </main>

  <footer class="flex-shrink-0"></footer>

  <OptionsOffscreen />

  <ToastAlerts />
</template>
