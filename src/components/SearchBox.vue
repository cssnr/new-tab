<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { openUrl } from '@/utils/index.ts'
import { Search, deleteSearch, getSearches, addSearch, updateSearch } from '@/utils/searches.ts'
import camelCase from 'camelcase'
import * as icons from 'simple-icons'
import claudeIcon from '@/assets/icons/claude.svg?raw'
import SearchModal from '@/components/SearchModal.vue'

const props = withDefaults(
  defineProps<{
    newTab?: boolean
    closeWindow?: boolean
    expandedRows?: number
  }>(),
  {
    newTab: false,
    closeWindow: false,
    expandedRows: 10,
  },
)

console.debug('%cLOADED: SearchBox.vue', 'color: Orange', 'props', props)

const isFocused = ref(false)
const containerRef = ref<HTMLElement | null>(null)
const textRef = useTemplateRef<HTMLTextAreaElement>('textRef')

const searchesRef = ref<Search[]>([])

const isEditing = ref(false)

chrome.storage.sync.onChanged.addListener((changes) => {
  if (changes.searches) {
    console.log('searches changed:', changes.searches.newValue)
    searchesRef.value = changes.searches.newValue as Search[]
  }
})

// chrome.storage.sync.onChanged.addListener(onChanged)
// function onChanged(changes: object) {}

function getIcon(slug: string) {
  console.log('getIcon:', slug)
  try {
    const name = camelCase(slug, { pascalCase: true })
    console.log('name:', name)
    return icons[`si${name}` as keyof typeof icons]?.svg
    // return icons[('si' + slug.charAt(0).toUpperCase() + slug.slice(1)) as keyof typeof icons].svg
  } catch (e) {
    return ''
  }
}

const searchModal = ref<InstanceType<typeof SearchModal> | null>(null)

// Opens with empty fields
async function addSearchClick(e: MouseEvent) {
  console.debug('addSearchClick:', e)
  searchModal.value?.open()
}

// // Opens with pre-filled values
// async function editSearch(search: Search) {
//   searchModal.value?.open(search)
// }

function onAdd(search: Search) {
  console.log('onAdd:', search)
  addSearch(search)
}

function onSave(search: Search) {
  console.log('onSave:', search)
  updateSearch(search)
}

function onDelete(search: Search) {
  console.log('onDelete:', search)
  deleteSearch(search.id)
}

async function processSearch(search: Search) {
  console.log('processSearch:', search)
  if (isEditing.value) {
    searchModal.value?.open(search)
    return
  }
  const value = textRef.value?.value ?? ''
  console.log('value:', value)
  const url = search.url + encodeURIComponent(value)
  console.debug('url:', url)
  props.newTab ? window.open(url) : openUrl(url)
}

async function defaultSearch(e: Event) {
  console.log('defaultSearch:', e)
  const value = textRef.value?.value ?? ''
  console.log('value:', value)
  const disposition = props.newTab ? 'NEW_TAB' : 'CURRENT_TAB'
  await chrome.search.query({ text: value, disposition })
}

// async function processSearch(e: SubmitEvent) {
//   console.debug('processSearch:', e)
//   try {
//     const target = e.currentTarget as HTMLFormElement
//     console.debug('target:', target)
//     // console.debug('submitter:', e.submitter)
//     e.preventDefault()
//     const input = target[0] as HTMLInputElement
//     console.debug('value:', input.value)
//
//     const idx = e.submitter?.dataset.idx
//     console.debug('idx:', idx)
//     if (idx === undefined) {
//       const disposition = props.newTab ? 'NEW_TAB' : 'CURRENT_TAB'
//       await chrome.search.query({ text: input.value, disposition })
//     } else {
//       const search = searchesRef.value[Number.parseInt(idx)]
//       console.debug('search:', search)
//       const url = search.url + encodeURIComponent(input.value)
//       console.debug('url:', url)
//       props.newTab ? window.open(url) : openUrl(url)
//     }
//
//     // switch (e.submitter?.dataset.search) {
//     //   case 'github': {
//     //     const url = `https://github.com/search?q=${encodeURIComponent(input.value)}`
//     //     props.newTab ? window.open(url) : openUrl(url)
//     //     break
//     //   }
//     //   default: {
//     //     const disposition = props.newTab ? 'NEW_TAB' : 'CURRENT_TAB'
//     //     await chrome.search.query({ text: input.value, disposition })
//     //     break
//     //   }
//     // }
//     if (props.closeWindow) window.close()
//   } catch (e) {
//     if (e instanceof Error) showToast(e.message, 'danger')
//   }
// }

async function processAI(e: MouseEvent | KeyboardEvent | SubmitEvent) {
  console.debug('processAI', e)
  try {
    const value = textRef.value?.value
    console.debug('value:', value)
    if (value?.trim()) await chrome.storage.local.set({ claudePrompt: value })
    // await chrome.tabs.update({ url: 'https://claude.ai/new' })
    if (props.newTab) {
      await chrome.tabs.create({ url: 'https://claude.ai/new' })
    } else {
      openUrl('https://claude.ai/new')
    }
  } catch (e) {
    if (e instanceof Error) showToast(e.message, 'danger')
  }
}

function onDocumentMousedown(e: MouseEvent) {
  if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
    isFocused.value = false
  }
}

onMounted(async () => {
  console.debug('%cMOUNTED: SearchBox.vue', 'color: Lime', 'props', props)
  document.addEventListener('mousedown', onDocumentMousedown)
  const searches = await getSearches()
  console.debug('searches:', searches)
  searchesRef.value = searches
})
onUnmounted(() => {
  console.debug('%cUNMOUNTED: SearchBox.vue', 'color: Yellow', 'props', props)
  document.removeEventListener('mousedown', onDocumentMousedown)
})
</script>

<template>
  <div ref="containerRef">
    <form id="search-form">
      <div class="form-floating">
        <textarea
          ref="textRef"
          class="form-control"
          :class="{ 'is-expanded': isFocused }"
          :style="{ '--expanded-rows': props.expandedRows }"
          placeholder="Leave a comment here"
          id="floatingTextarea"
          @focus="isFocused = true"
          @keydown.ctrl.enter.prevent="processAI"
          @keydown.meta.enter.prevent="processAI"
        />
        <label for="floatingTextarea">Questions, Comments or Concerns about Ralf?</label>
      </div>
    </form>
    <div class="d-flex flex-wrap justify-content-center gap-2 my-2">
      <button class="btn btn-warning" @click="processAI">
        <span class="icon" v-html="claudeIcon" />
        AI (Ctrl+Enter)
      </button>
      <button class="btn btn-success" @click="defaultSearch">
        <i class="fa-solid fa-magnifying-glass"></i>
      </button>
      <button
        v-for="(search, i) of searchesRef"
        :data-idx="i"
        :class="[`btn btn-${search.style}`, { 'fa-fade': isEditing }]"
        type="button"
        form="search-form"
        @click="processSearch(search)"
      >
        <span class="icon" v-html="getIcon(search.icon)" /> {{ search.name }}
      </button>
      <button :class="['btn', isEditing ? 'btn-warning' : 'btn-outline-warning']" @click="isEditing = !isEditing">
        <i class="fa-regular fa-pen-to-square"></i>
      </button>
      <button class="btn btn-outline-success" @click="addSearchClick">
        <i class="fa-solid fa-add"></i>
      </button>
      <!--<button @click="searchModal?.open(search)">Edit</button>-->
      <!--<button-->
      <!--  @click="editSearch({ name: 'Google', icon: 'google', style: 'btn-primary', url: 'https://google.com?q=' })"-->
      <!--&gt;-->
      <!--  Edit Search-->
      <!--</button>-->

      <!-- Just declare it once, no id needed -->
      <SearchModal ref="searchModal" @save="onSave" @delete="onDelete" @add="onAdd" />
    </div>
  </div>
</template>

<style scoped>
.form-control {
  --expanded-rows: 10;
  resize: none;
  transition: height 0.2s ease;
}

.form-control.is-expanded {
  height: calc(var(--expanded-rows) * 1.5rem + 1rem);
}
</style>
