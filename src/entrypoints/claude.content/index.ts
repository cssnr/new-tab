import { defineContentScript } from 'wxt/utils/define-content-script'

const TAG = 'new-tab'

export default defineContentScript({
  matches: ['https://claude.ai/*'],
  async main(ctx) {
    console.log(`${TAG} - %c Loaded: content/index.ts`, 'color: Lime', ctx)

    const result = await chrome.storage.local.get('claudePrompt')
    const claudePrompt = result['claudePrompt'] as string | undefined
    console.log(`${TAG} - claudePrompt:`, claudePrompt)
    if (!claudePrompt) return console.log(`${TAG} - %c no claudePrompt`, 'color: Cyan')

    chrome.storage.local.remove('claudePrompt').catch(console.warn)

    if (document.querySelector('.tiptap')) {
      console.log(`${TAG} - %c Run on querySelector`, 'color: SpringGreen')
      processClaude(claudePrompt).catch(console.warn)
      return
    }

    const observer = new MutationObserver((_records, observer) => {
      // console.log(`${TAG} - mutation:`, _records)
      if (document.querySelector('.tiptap')) {
        console.log(`${TAG} - %c Run on MutationObserver`, 'color: Yellow')
        observer.disconnect()
        processClaude(claudePrompt).catch(console.warn)
      }
    })

    console.log(`${TAG} - %c MutationObserver: start`, 'color: Fuchsia')
    observer.observe(document.body, { childList: true, subtree: true })

    setTimeout(() => {
      console.log(`${TAG} - %c MutationObserver: timeout`, 'color: Orange')
      observer.disconnect()
    }, 10000)
  },
})

async function processClaude(claudePrompt: string) {
  console.log(`${TAG} - %c processClaude START`, 'color: Yellow')
  const editor = document.querySelector('.tiptap')
  if (!editor) return console.error(`${TAG} - %c missing editor`, 'color: OrangeRed')

  const escape = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  editor.innerHTML = claudePrompt
    .split('\n')
    .map((line) => (line.trim() === '' ? '<p><br></p>' : `<p>${escape(line)}</p>`))
    .join('')

  await new Promise((resolve) => requestAnimationFrame(resolve))
  editor.dispatchEvent(new InputEvent('input', { bubbles: true }))
  await new Promise((resolve) => requestAnimationFrame(resolve))
  editor.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
  console.log(`${TAG} - %c processClaude DONE`, 'color: Lime')
}
