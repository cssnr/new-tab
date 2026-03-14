import { createApp } from 'vue'
import App from './App.vue'

/**
 * Mount the Vue app to the DOM.
 */
function mountApp() {
  const container = document.createElement('div')
  container.id = 'content-app'
  document.body.appendChild(container)
  const app = createApp(App)
  app.mount(container)
}

export default defineContentScript({
  matches: ['https://claude.ai/*'],
  main() {
    console.log('%c new-tab: content/index.ts', 'color: Lime')
    mountApp()
  },
})
