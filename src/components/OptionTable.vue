<script setup lang="ts">
import { onMounted } from 'vue'

const props = withDefaults(
  defineProps<{
    option?: string
  }>(),
  {},
)

onMounted(async () => {
  const { items } = await chrome.storage.sync.get(props.option)
  console.log('items', items)
})
</script>

<template>
  <p>ralf broke</p>
</template>

<!--<style scoped></style>-->
