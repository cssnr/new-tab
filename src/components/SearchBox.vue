<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = withDefaults(
  defineProps<{
    closeWindow?: boolean
    expandedRows?: number
  }>(),
  {
    closeWindow: false,
    expandedRows: 6,
  },
)

console.debug('closeWindow:', props.closeWindow)

const isFocused = ref(false)
const containerRef = ref<HTMLElement | null>(null)
const textRef = useTemplateRef<HTMLTextAreaElement>('textRef')

async function processForm(e: Event) {
  console.debug('processForm:', e)
  try {
    const target = e.currentTarget as HTMLFormElement
    e.preventDefault()
    const input = target[0] as HTMLInputElement
    console.debug('target.value', input.value)
    await chrome.search.query({ text: input.value, disposition: 'CURRENT_TAB' })
  } catch (e) {
    if (e instanceof Error) showToast(e.message, 'danger')
  }
}

async function retardAI(e: MouseEvent) {
  console.debug('retardAI', e)
  try {
    const value = textRef.value?.value
    console.debug('value:', value)
    if (textRef.value?.value) await chrome.storage.local.set({ claudePrompt: value })
    await chrome.tabs.update({ url: 'https://claude.ai/new' })
  } catch (e) {
    if (e instanceof Error) showToast(e.message, 'danger')
  }
}

function onDocumentMousedown(e: MouseEvent) {
  if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
    isFocused.value = false
  }
}

onMounted(() => document.addEventListener('mousedown', onDocumentMousedown))
onUnmounted(() => document.removeEventListener('mousedown', onDocumentMousedown))
</script>

<template>
  <div ref="containerRef">
    <form id="search-form" @submit.prevent="processForm">
      <div class="form-floating">
        <textarea
          ref="textRef"
          class="form-control"
          :class="{ 'is-expanded': isFocused }"
          :style="{ '--expanded-rows': props.expandedRows }"
          placeholder="Leave a comment here"
          id="floatingTextarea"
          @focus="isFocused = true"
        />
        <label for="floatingTextarea">Questions, Comments or Concerns about Ralf?</label>
      </div>
    </form>
    <div class="d-flex flex-wrap justify-content-center gap-2 my-2">
      <button class="btn btn-warning" @click="retardAI"><i class="fa-solid fa-hexagon-nodes"></i> Retard AI</button>
      <button class="btn btn-success" type="submit" form="search-form">
        <i class="fa-solid fa-magnifying-glass"></i> Not AI
      </button>
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
