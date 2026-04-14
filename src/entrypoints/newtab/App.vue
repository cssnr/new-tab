<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
// import { Options, getOptions } from '@/utils/options.ts'
import { useBackground } from '@/composables/useBackground.ts'
import { useOptions } from '@/composables/useOptions.ts'
// import { useWallpaperDB } from '@/composables/useWallpaperDB.ts'
import GitHubRepos from '@/components/GitHubRepos.vue'
import SearchBox from '@/components/SearchBox.vue'
import ToastAlerts from '@/components/ToastAlerts.vue'
import TopSites from '@/components/TopSites.vue'
import OptionsOffscreen from '@/components/OptionsOffscreen.vue'
import { useTitle } from '@/composables/useTitle.ts'
// import BookmarksFolder from '@/components/BookmarksFolder.vue'
// import ImageManager from '@/components/ImageManager.vue'
// import UppyDrop from '@/components/UppyDrop.vue'

console.debug('%cLOADED: newtab/App.vue', 'color: Orange')

useTitle(i18n.t('newtab.title'))

useBackground()

// const { getSelected } = useWallpaperDB()

const options = useOptions()

const githubSearch = ref<InstanceType<typeof GitHubRepos> | null>(null)

// const imagesShown = ref(false)
// const toggleImages = () => (imagesShown.value = !imagesShown.value)

function handleKeyboard(e: KeyboardEvent) {
  if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || e.repeat) return

  const target = e.target as HTMLInputElement
  if (['INPUT', 'TEXTAREA', 'SELECT', 'OPTION'].includes(target?.tagName)) return
  if (e.key.length !== 1 && e.key !== 'Backspace') return

  console.log(`handleKeyboard: ${e.code} "${e.key}" - ${e.key.length}`)
  githubSearch.value?.focusSearch(e.key)
}

// watchEffect(async () => {
//   const bgImage = options.value.bgImage // access before await — tracked by Vue
//   if (!bgImage) return
//   await new Promise((resolve) => {
//     const img = new Image()
//     img.onload = resolve
//     img.onerror = resolve
//     img.src = bgImage
//   })
//   document.body.style.background = `url('${bgImage}') no-repeat center fixed`
// })

onMounted(async () => {
  console.debug('%cMOUNTED: newtab/App.vue', 'color: Lime')
  window.addEventListener('keydown', handleKeyboard)

  // const selected = await getSelected()
  // console.log('selected:', selected)
  // const getRandomElement = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)]
  // const randomElement = getRandomElement(selected)
  // console.log('rand:', randomElement)
  // if (randomElement?.data) {
  //   // Convert the Blob to an object URL
  //   const imageUrl = URL.createObjectURL(randomElement.data)
  //   console.log('imageUrl:', imageUrl)
  //   document.body.style.background = `url('${imageUrl}') no-repeat center fixed`
  // }
})

onUnmounted(() => {
  console.debug('%cUNMOUNTED: newtab/App.vue', 'color: Yellow')
  window.removeEventListener('keydown', handleKeyboard)
})
</script>

<template>
  <header class="flex-shrink-0">
    <SearchBox class="m-2" :expanded-rows="options.expandedRows" />

    <!--<BookmarksFolder class="m-2" />-->

    <TopSites
      v-if="options?.showTopSites"
      :num-items="options.numTopSites"
      :text-rows="options.textRows"
      :size="options.iconSize"
      class="m-2"
    />
  </header>

  <main class="flex-grow-1 overflow-auto">
    <div class="container-fluid px-4 h-100">
      <div class="d-flex align-items-center justify-content-center w-100 h-100 pb-3" style="min-height: 200px">
        <div class="glass-outline rounded rounded-3 my-0 mx-auto w-100 h-100 d-flex flex-column">
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

  <OptionsOffscreen />

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
