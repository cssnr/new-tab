import { type Ref, onMounted, onUnmounted, ref } from 'vue'
import { type Options, getOptions } from '@/utils/options.ts'

export function useOptions(): Ref<Options> {
  // console.debug('%cLOADED composables/useOptions.ts', 'color: Orange')
  const options = ref<Options>({} as Options)

  const onChanged = async (changes: any) => {
    // console.log('useOptions - onChanged:', changes)
    if ('options' in changes) {
      // console.log('%c composables/useOptions.ts - CHANGE DETECTED ', 'color: Yellow')
      options.value = await getOptions()
    }
  }

  if (!chrome.storage.sync.onChanged.hasListener(onChanged)) {
    // console.debug('%c useOptions - addListener', 'color: Lime')
    chrome.storage.sync.onChanged.addListener(onChanged)
  }

  onMounted(() => getOptions().then((results) => (options.value = results)))
  onUnmounted(() => chrome.storage.sync.onChanged.removeListener(onChanged))

  return options
}
