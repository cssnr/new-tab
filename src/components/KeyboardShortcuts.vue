<script setup lang="ts">
import { isFirefox } from '@/utils/system.ts'
import { onMounted } from 'vue'

function openChromeShortcuts() {
  chrome.tabs.update({ url: 'chrome://extensions/shortcuts' })
}

onMounted(() => {
  setShortcuts()
})

// NOTE: Below is ported from VanillaJS
async function setShortcuts(selector = '#keyboard-shortcuts') {
  console.debug('setShortcuts')
  if (!chrome.commands) {
    return console.debug('Skipping: chrome.commands')
  }
  const table = document.querySelector(selector)
  if (!table) {
    return console.warn(`Table not found: ${selector}`)
  }
  table.classList.remove('d-none')
  const tbody = table.querySelector('tbody')
  const source = table.querySelector('tfoot > tr')?.cloneNode(true)
  if (!tbody || !source) {
    return console.warn(`Source element not found!`)
  }
  const commands = await chrome.commands.getAll()
  for (const command of commands) {
    // console.debug('command:', command)
    const row = source.cloneNode(true) as Element
    let description = command.description
    // Note: Chrome does not parse the description for _execute_action in manifest.json
    if (!description && command.name === '_execute_action') {
      description = 'Open Popup' // NOTE: Also defined in: manifest.json
    }
    row.querySelector('.description')!.textContent = description ?? null
    row.querySelector('kbd')!.textContent = command.shortcut || 'Not Set'
    tbody.appendChild(row)
  }
}
</script>

<template>
  <div>
    <table id="keyboard-shortcuts" class="table table-sm rounded table-borderless table-hover d-none">
      <caption class="visually-hidden">
        Keyboard Shortcuts
      </caption>
      <thead class="visually-hidden">
        <tr>
          <th>Description</th>
          <th>Shortcut</th>
        </tr>
      </thead>
      <tbody></tbody>
      <tfoot class="d-none">
        <tr>
          <td class="bg-transparent">
            <i class="fa-regular fa-keyboard me-1"></i>
            <span class="description"></span>
          </td>
          <td class="bg-transparent text-end" title="Keyboard Shortcut">
            <kbd>Unknown</kbd>
          </td>
        </tr>
      </tfoot>
    </table>
    <!-- keyboard-shortcuts -->

    <div class="mb-2">
      Manage Keyboard Shortcuts:
      <a
        v-if="isFirefox"
        class="text-decoration-none d-inline-block firefox"
        href="https://support.mozilla.org/en-US/kb/manage-extension-shortcuts-firefox"
        target="_blank"
        rel="noopener"
      >
        https://mzl.la/3Qwp5QQ
        <i class="fa-solid fa-arrow-up-right-from-square fa-xs"></i
      ></a>
      <a
        v-if="!isFirefox"
        id="chrome-shortcuts"
        class="d-inline-block chrome"
        role="button"
        @click="openChromeShortcuts"
        >chrome://extensions/shortcuts</a
      >
    </div>
  </div>
</template>

<style scoped>
/* NOTE: For brite bootswatch theme */
table {
  border-collapse: separate;
}
</style>
