// composables/useOptions.ts
import { ref, onMounted, onUnmounted } from 'vue'
import type { Ref } from 'vue'

export function useOptions(): Ref<Options> {
  const options = ref<Options>({} as Options)

  const listener = async () => (options.value = await getOptions())

  if (!chrome.storage.onChanged.hasListener(listener)) {
    chrome.storage.onChanged.addListener(listener)
  }

  onMounted(() => getOptions().then((results) => (options.value = results)))
  onUnmounted(() => chrome.storage.onChanged.removeListener(listener))

  return options
}
