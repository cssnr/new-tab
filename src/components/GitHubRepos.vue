<script setup lang="ts">
import { computed, nextTick, ref, onMounted } from 'vue'
import { showToast } from '@/composables/useToast.ts'
import { getOptions } from '@/utils/options.ts'
import { openUrl } from '@/utils/index.ts'
import { getRepo } from '@/utils/github.ts'

const props = defineProps<{
  githubUrl: string
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const repos = ref<string[]>([])
const filterTerm = ref('')

const filterMsg = computed(() => `Filter ${repos.value.length} Repositories`)

const filteredRepos = computed(() =>
  filterTerm.value
    ? repos.value.filter((url) => url.toLowerCase().includes(filterTerm.value.toLowerCase()))
    : repos.value,
)

function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// const GITHUB_REPO_REGEX = /^https:\/\/github\.com\/([^/?#]+)\/([^/?#]+)/
const GITHUB_REPO_REGEX = new RegExp(`^${escapeRegex(props.githubUrl)}/([^/?#]+)/([^/?#]+)`)
console.log('GITHUB_REPO_REGEX:', GITHUB_REPO_REGEX)

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

function clearFilter() {
  filterTerm.value = ''
  const input = inputRef.value
  if (input) {
    input.value = ''
    input.focus()
  }
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
          const [, owner, repo] = match ?? []
          if (owner && repo && !GITHUB_RESERVED_PATHS.has(owner)) {
            acc.push(`${props.githubUrl}/${owner}/${repo}`)
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

function parseRepo(url: string) {
  const repo = getRepo(url)
  if (!repo) return url
  return `${repo.owner}/${repo.name}`
}
</script>

<template>
  <div class="d-flex flex-column h-100">
    <form @submit.prevent="onSubmit">
      <label for="image-input" class="visually-hidden">Image Link</label>
      <div class="input-group">
        <div class="clear-wrap">
          <input
            ref="inputRef"
            @input="onInput"
            @keydown.esc="clearFilter"
            id="image-input"
            type="text"
            class="form-control form-control-sm"
            :placeholder="filterMsg"
            :aria-label="filterMsg"
            autocomplete="off"
            required
          />
          <button
            v-if="filterTerm"
            type="button"
            class="clear-input-btn"
            tabindex="-1"
            aria-label="Clear filter"
            title="Clear filter"
            @click="clearFilter"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <button class="btn btn-success" type="submit" tabindex="-1">Go</button>
      </div>
    </form>
    <div class="flex-grow-1 overflow-auto mt-2" tabindex="-1">
      <ul>
        <li v-for="url in filteredRepos" :key="url">
          <a :href="url" @click.prevent="openUrl(url)">{{ parseRepo(url) }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.clear-wrap {
  position: relative;
  display: flex;
  flex: 1 1 auto;
  width: 1%;
  min-width: 0;
}

.clear-wrap > .form-control {
  padding-right: 2rem;
  border-end-start-radius: 0;
  border-end-end-radius: 0;
  margin-right: calc(-1 * var(--bs-border-width, 1px));
}

.clear-wrap > .form-control:focus {
  z-index: 5;
}

.clear-input-btn {
  position: absolute;
  top: 50%;
  right: 0.25rem;
  transform: translateY(-50%);
  z-index: 6;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem 0.5rem;
  line-height: 1;
  color: var(--bs-secondary-color);
  background: transparent;
  border: 0;
}

.clear-input-btn:hover {
  color: var(--bs-body-color);
}
</style>
