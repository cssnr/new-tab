<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  owner?: string
  repo?: string
}>()

interface Badge {
  name: string
  src: string
  href?: string
}

const badges = computed<Badge[]>(() => [
  {
    name: 'downloads',
    src: `https://img.shields.io/github/downloads/${props.owner}/${props.repo}/total?logo=rolldown&logoColor=white&label=%20`,
    href: `https://tooomm.github.io/github-release-stats/?username=${props.owner}/&repository=${props.repo}`,
  },
  {
    name: 'stars',
    src: `https://img.shields.io/github/stars/${props.owner}/${props.repo}?style=flat&logo=gleam&logoColor=white&label=%20`,
    href: `https://github.com/${props.owner}/${props.repo}/stargazers`,
  },
  {
    name: 'contributors',
    src: `https://img.shields.io/github/contributors-anon/${props.owner}/${props.repo}?logo=southwestairlines&label=%20`,
    href: `https://github.com/${props.owner}/${props.repo}/graphs/contributors`,
  },
  {
    name: 'discussions',
    src: `https://img.shields.io/github/discussions/${props.owner}/${props.repo}?logo=theconversation&label=%20`,
    href: `https://github.com/${props.owner}/${props.repo}/discussions`,
  },
  {
    name: 'languages',
    src: `https://img.shields.io/github/languages/top/${props.owner}/${props.repo}`,
  },
  {
    name: 'repo-size',
    src: `https://img.shields.io/github/repo-size/${props.owner}/${props.repo}?logo=buffer&label=%20`,
  },
  {
    name: 'repo-size',
    src: `https://img.shields.io/github/v/release/${props.owner}/${props.repo}?logo=github`,
    href: `https://github.com/${props.owner}/${props.repo}/releases`,
  },
])
</script>

<template>
  <div>
    <div class="d-flex flex-wrap justify-content-center align-content-center column-gap-2 row-gap-0 mb-1">
      <a v-for="badge in badges" :key="badge.name" :href="badge.href" target="_blank">
        <img :alt="badge.name" :src="badge.src" />
      </a>
    </div>
    <div>
      <a
        :href="`https://www.star-history.com/#${props.owner}/${props.repo}&type=date&legend=top-left`"
        target="_blank"
        rel="noopener"
      >
        <img
          id="history"
          alt="Star History Chart"
          class="w-100"
          :src="`https://api.star-history.com/svg?repos=${props.owner}/${props.repo}&type=date&legend=bottom-right&theme=dark`"
        />
      </a>
    </div>
  </div>
</template>

<!--<style scoped></style>-->
