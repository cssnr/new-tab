<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getOptions } from '@/utils/options.ts'
// import { useWallpaperDB } from '@/composables/useWallpaperDB.ts'
import GitHubRepos from '@/components/GitHubRepos.vue'
import SearchBox from '@/components/SearchBox.vue'
import ToastAlerts from '@/components/ToastAlerts.vue'
import TopSites from '@/components/topSites.vue'
// import ImageManager from '@/components/ImageManager.vue'
// import UppyDrop from '@/components/UppyDrop.vue'

// const { getSelected } = useWallpaperDB()

const githubSearch = ref<InstanceType<typeof GitHubRepos> | null>(null)
const expandedRows = ref(10)

const imagesShown = ref(false)

// const toggleImages = () => (imagesShown.value = !imagesShown.value)

function handleKeyboard(e: KeyboardEvent) {
  if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || e.repeat) return

  const target = e.target as HTMLInputElement
  if (['INPUT', 'TEXTAREA', 'SELECT', 'OPTION'].includes(target?.tagName)) return
  if (e.key.length !== 1 && e.key !== 'Backspace') return

  console.log(`handleKeyboard: ${e.code} "${e.key}" - ${e.key.length}`)
  githubSearch.value?.focusSearch(e.key)
}

onMounted(async () => {
  window.addEventListener('keydown', handleKeyboard)
  const options = await getOptions()
  console.log('expandedRows:', options.expandedRows)
  expandedRows.value = options.expandedRows

  // const selected = await getSelected()
  // console.log('selected:', selected)
  //
  // const getRandomElement = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)]
  // const randomElement = getRandomElement(selected)
  // console.log('rand:', randomElement)
  //
  // if (randomElement?.data) {
  //   // Convert the Blob to an object URL
  //   const imageUrl = URL.createObjectURL(randomElement.data)
  //   console.log('imageUrl:', imageUrl)
  //   document.body.style.background = `url('${imageUrl}') no-repeat center fixed`
  // }

  // if (options.bgImage) document.body.style.background = `url('${options.bgImage}') no-repeat center fixed`
  // use browser cache
  if (options.bgImage) {
    await new Promise((resolve) => {
      const img = new Image()
      img.onload = resolve
      img.onerror = resolve
      img.src = options.bgImage
    })
    document.body.style.background = `url('${options.bgImage}') no-repeat center fixed`
  }
})

// useTitle('Page')
</script>

<template>
  <header class="flex-shrink-0">
    <SearchBox class="m-2" :expanded-rows="expandedRows" />

    <TopSites v-if="!imagesShown" class="m-2" />
  </header>

  <main class="flex-grow-1 overflow-auto">
    <div v-if="!imagesShown" class="container-fluid px-4 h-100">
      <div class="d-flex align-items-center justify-content-center w-100 h-100 pb-3" style="min-height: 200px">
        <div class="glass-outline blur rounded rounded-3 my-0 mx-auto w-100 h-100 d-flex flex-column">
          <div class="p-3 flex-grow-1 overflow-auto">
            <GitHubRepos ref="githubSearch" />
          </div>
        </div>
      </div>
    </div>

    <!--<ImageManager v-if="imagesShown" />-->
  </main>

  <footer class="flex-shrink-0">
    <!--<hr class="my-0" />-->
    <!--<PageFooter class="m-2" />-->
  </footer>

  <!--<button-->
  <!--  id="toggle-history"-->
  <!--  type="button"-->
  <!--  :class="['btn', imagesShown ? 'btn-primary' : 'btn-link']"-->
  <!--  @click="toggleImages"-->
  <!--&gt;-->
  <!--  <i class="fa-solid fa-image"></i>-->
  <!--</button>-->

  <!--<UppyDrop />-->

  <ToastAlerts />
  <!--<BackToTop />-->
</template>

<!--<style scoped>-->
<!--#toggle-history {-->
<!--  position: fixed;-->
<!--  bottom: 10px;-->
<!--  right: 10px;-->
<!--  z-index: 3;-->
<!--}-->
<!--</style>-->
