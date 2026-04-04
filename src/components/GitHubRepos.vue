<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { showToast } from '@/composables/useToast.ts'
import { getOptions } from '@/utils/options.ts'
import { openUrl } from '@/utils/index.ts'

const inputRef = ref<HTMLInputElement | null>(null)
const repos = ref<string[]>([])
const filterTerm = ref('')

const filterMsg = computed(() => `Filter ${repos.value.length} Repositories`)

const filteredRepos = computed(() =>
  filterTerm.value
    ? repos.value.filter((url) => url.toLowerCase().includes(filterTerm.value.toLowerCase()))
    : repos.value,
)

const GITHUB_REPO_REGEX = /^https:\/\/github\.com\/([^/?#]+)\/([^/?#]+)/

const GITHUB_RESERVED_PATHS = new Set([
  'explore',
  'trending',
  'topics',
  'collections',
  'events',
  'search',
  'dashboard',
  'notifications',
  'issues',
  'pulls',
  'stars',
  'watching',
  'settings',
  'login',
  'logout',
  'join',
  'session',
  'sessions',
  'password_reset',
  'account',
  'new',
  'orgs',
  'organizations',
  'users',
  'teams',
  'marketplace',
  'sponsors',
  'features',
  'enterprise',
  'pricing',
  'security',
  'codespaces',
  'copilot',
  'apps',
  'gists',
  'about',
  'contact',
  'site',
  'home',
  'readme',
  '404',
  '500',
])

function onInput(e: InputEvent) {
  const target = e.currentTarget as HTMLInputElement
  filterTerm.value = target.value
}

function onSubmit() {
  if (filteredRepos.value.length === 0) {
    showToast('No repositories found.', 'warning')
    return
  }
  openUrl(filteredRepos.value[0])
}

async function updateRepos() {
  const options = await getOptions()
  const history = await chrome.history.search({
    text: 'github.com',
    startTime: 0,
    maxResults: options.maxResults,
  })

  repos.value = [
    ...new Set(
      history
        .sort((a, b) => (b.lastVisitTime ?? 0) - (a.lastVisitTime ?? 0))
        .reduce<string[]>((acc, { url }) => {
          const match = url?.match(GITHUB_REPO_REGEX)
          if (match && !GITHUB_RESERVED_PATHS.has(match[1])) {
            acc.push(`https://github.com/${match[1]}/${match[2]}`)
          }
          return acc
        }, []),
    ),
  ]
}

onMounted(async () => {
  await updateRepos()
  inputRef.value?.focus()
})

const searchQuery = ref('')

function focusSearch(char: string) {
  searchQuery.value += char // append the triggering character
  nextTick(() => {
    inputRef.value?.focus()
    // Move cursor to end
    const len = inputRef.value?.value.length ?? 0
    inputRef.value?.setSelectionRange(len, len)
  })
}

defineExpose({ focusSearch })
</script>

<template>
  <div class="d-flex flex-column h-100">
    <form @submit.prevent="onSubmit">
      <label for="image-input" class="visually-hidden">Image Link</label>
      <div class="input-group">
        <input
          ref="inputRef"
          @input="onInput"
          id="image-input"
          type="text"
          class="form-control form-control-sm"
          :placeholder="filterMsg"
          :aria-label="filterMsg"
          autocomplete="off"
          required
        />
        <button class="btn btn-success" type="submit">Go</button>
      </div>
    </form>
    <div class="flex-grow-1 overflow-auto mt-2">
      <ul>
        <li v-for="url in filteredRepos" :key="url">
          <a :href="url" @click.prevent="openUrl(url)">{{ url?.replace('https://github.com/', '') }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<!--<style scoped></style>-->
