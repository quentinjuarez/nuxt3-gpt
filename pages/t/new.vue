<template>
  <div class="space-y-4">
    <h1 class="text-4xl font-bold">New template</h1>

    <UForm :validate="validate" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormGroup label="Title" name="title">
        <UInput v-model="state.title" />
      </UFormGroup>

      <UButton type="submit" block :loading="loading">Create</UButton>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import type { FormError } from '#ui/types'
definePageMeta({
  middleware: 'auth'
})

const state = reactive({
  title: undefined
})

const store = useStore()
const router = useRouter()
const loading = ref(false)

const validate = (state: any): FormError[] => {
  const errors = []
  if (!state.title) errors.push({ path: 'title', message: 'Required' })

  return errors
}

async function onSubmit() {
  await createTemplate()
}

const toast = useToast()

const createTemplate = async () => {
  loading.value = true

  const { data, error } = await useFetch<{
    template: Template
  }>('/api/templates/create', {
    method: 'POST',
    body: {
      title: state.title
    }
  })

  loading.value = false

  if (error.value) {
    return toast.add({
      id: 'template-error',
      title: error.value.statusMessage,
      description: error.value.data.message,
      timeout: 5000,
      color: 'red'
    })
  }

  if (data.value) {
    store.addTemplate(data.value.template)

    router.push(`/t/${data.value?.template.id}`)
  }
}
</script>
