<script setup lang="ts">
import ToastAlerts from '@/components/ToastAlerts.vue'
import BackToTop from '@/components/BackToTop.vue'
import SearchBox from '@/components/SearchBox.vue'
import GitHubRepos from '@/components/GitHubRepos.vue'
import { onMounted, ref } from 'vue'

const githubSearch = ref<InstanceType<typeof GitHubRepos> | null>(null)

function handleKeyboard(e: KeyboardEvent) {
  if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || e.repeat) return

  const target = e.target as HTMLInputElement
  if (['INPUT', 'TEXTAREA', 'SELECT', 'OPTION'].includes(target?.tagName)) return
  if (e.key.length !== 1 && e.key !== 'Backspace') return

  console.log(`handleKeyboard: ${e.code} "${e.key}" - ${e.key.length}`)
  githubSearch.value?.focusSearch(e.key)
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyboard)
})

// useTitle('Page')
</script>

<template>
  <header class="flex-shrink-0">
    <SearchBox class="p-2" />
    <hr class="my-0" />
  </header>

  <main class="flex-grow-1 overflow-auto">
    <div class="container-fluid px-4 h-100">
      <div class="d-flex align-items-center justify-content-center w-100 h-100 py-3">
        <div class="glass-outline blur rounded rounded-3 my-0 mx-auto w-100 h-100 d-flex flex-column">
          <div class="p-3 flex-grow-1 overflow-auto">
            <GitHubRepos ref="githubSearch" />
          </div>
        </div>
      </div>
    </div>
  </main>

  <footer class="flex-shrink-0">
    <!--<hr class="my-0" />-->
    <!--<PageFooter class="m-2" />-->
  </footer>

  <ToastAlerts />
  <BackToTop />
</template>

<!--<style scoped></style>-->
