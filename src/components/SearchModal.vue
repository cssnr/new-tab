<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Search } from '@/utils/searches.ts'
import { Modal } from 'bootstrap'

const isEditing = ref(false)

// --- Internal form state (not props!) ---
const id = ref('')
const name = ref('')
const icon = ref('')
const style = ref('')
const url = ref('')

// --- Bootstrap modal setup ---
const modalEl = ref<HTMLElement | null>(null)
let bsModal: Modal | null = null

console.debug('%cLOADED: SearchModal.vue', 'color: Orange')

onMounted(() => {
  console.debug('%cMOUNTED: SearchModal.vue', 'color: Lime')
  if (modalEl.value) {
    bsModal = new Modal(modalEl.value)
  }
})

onUnmounted(() => {
  console.debug('%cUNMOUNTED: SearchModal.vue', 'color: Yellow')
  bsModal?.dispose()
})

// --- Public API exposed to parent ---
function open(data?: Partial<Search>) {
  isEditing.value = !!data
  id.value = data?.id ?? ''
  name.value = data?.name ?? ''
  icon.value = data?.icon ?? ''
  style.value = data?.style ?? ''
  url.value = data?.url ?? ''
  bsModal?.show()
}

function close() {
  bsModal?.hide()
}

defineExpose({ open, close })

const emit = defineEmits<{
  save: [Search]
  delete: [Search]
  add: [Search]
}>()

function handleSave() {
  console.log('handleSave:')
  console.log('name', name.value)
  console.log('icon', icon.value)
  console.log('style', style.value)
  console.log('url', url.value)
  if (isEditing.value) {
    const search: Search = { id: id.value, name: name.value, icon: icon.value, style: style.value, url: url.value }
    console.log('handleSave - emit save:', search)
    emit('save', search)
  } else {
    const search: Search = { name: name.value, icon: icon.value, style: style.value, url: url.value }
    console.log('handleSave - emit add:', search)
    emit('add', search)
  }
  close()
}

function handleDelete() {
  emit('delete', {
    id: id.value,
    name: name.value,
    icon: icon.value,
    style: style.value,
    url: url.value,
  })
  close()
}
</script>

<template>
  <div class="modal fade" ref="modalEl" tabindex="-1" aria-labelledby="edit-modal-label" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="edit-modal-label">{{ isEditing ? 'Edit' : 'Add' }} Search</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" tabindex="-1"></button>
        </div>
        <div class="modal-body">
          <form id="edit-form" name="edit-form" class="mb-3" autocomplete="off" @submit.prevent="handleSave">
            <label for="name" class="form-label"><i class="fa-regular fa-address-card me-2"></i> Name</label>
            <input v-model="name" id="name" placeholder="Search Name" type="text" class="form-control" required />

            <label for="icon" class="form-label"><i class="fa-solid fa-icons me-2"></i> Icon</label>
            <input v-model="icon" id="icon" placeholder="Simple Icon Slug" type="text" class="form-control" required />

            <label for="style" class="form-label"><i class="fa-brands fa-bootstrap me-2"></i> Style</label>
            <input v-model="style" id="style" placeholder="Bootstrap Class" type="text" class="form-control" required />

            <label for="url" class="form-label"><i class="fa-solid fa-globe me-2"></i> URL</label>
            <input v-model="url" id="url" placeholder="Search Query URL" type="url" class="form-control" required />
          </form>
        </div>
        <div class="modal-footer">
          <button type="submit" form="edit-form" class="btn btn-success me-auto">
            {{ isEditing ? 'Save' : 'Add' }} <i class="fa-regular fa-floppy-disk ms-2"></i>
          </button>
          <button v-if="isEditing" type="button" class="btn btn-danger" @click="handleDelete">
            Delete <i class="fa-solid fa-trash-can ms-2"></i>
          </button>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>
