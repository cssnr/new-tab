<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

let observer: MutationObserver | null = null

async function submitRetard() {
  const result = await chrome.storage.local.get('claudePrompt')
  const claudePrompt = result['claudePrompt'] as string | undefined
  console.log('claudePrompt:', claudePrompt)
  if (!claudePrompt) return

  chrome.storage.local.remove('claudePrompt').catch((e) => console.log(e))

  const editor = document.querySelector('.tiptap') as HTMLElement | null
  if (!editor) return

  console.log('%c submitRetard - START', 'color: Yellow')
  editor.textContent = claudePrompt
  await new Promise((resolve) => setTimeout(resolve, 200))
  editor.dispatchEvent(new InputEvent('input', { bubbles: true }))
  await new Promise((resolve) => setTimeout(resolve, 200))
  editor.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
  console.log('%c submitRetard - DONE', 'color: Lime')
}

function waitForEditor() {
  // If already present, run immediately
  if (document.querySelector('.tiptap')) {
    submitRetard().catch((e) => console.warn(e))
    return
  }

  observer = new MutationObserver((_mutations, obs) => {
    if (document.querySelector('.tiptap')) {
      obs.disconnect()
      observer = null
      submitRetard().catch((e) => console.warn(e))
    }
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  })
}

onMounted(() => {
  console.log('%c new-tab: content/App.vue - onMounted', 'color: Lime')
  waitForEditor()
})

onUnmounted(() => {
  observer?.disconnect()
  observer = null
})
</script>

<!--<template></template>-->

<!--<style scoped></style>-->
