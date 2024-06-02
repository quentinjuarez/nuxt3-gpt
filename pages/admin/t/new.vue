<template>
  <div class="mx-auto flex h-full max-w-screen-lg flex-col space-y-6 p-6">
    <h1 class="text-4xl font-bold">New template</h1>

    <UForm :validate="validate" :state="state" class="w-96 space-y-4" @submit="onSubmit">
      <UFormGroup label="Title" name="title">
        <UInput v-model="state.title" autofocus />
      </UFormGroup>

      <UButton type="submit" block :loading="loading">Create</UButton>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import type { FormError } from '#ui/types'

definePageMeta({
  middleware: ['auth', 'admin'],
  layout: 'default'
})

const store = useStore()

const state = reactive({
  title: undefined
})

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

const createTemplate = async () => {
  try {
    loading.value = true

    const data = await $fetch<{
      template: Template
    }>('/api/templates/create', {
      method: 'POST',
      body: {
        title: state.title
      }
    })

    store.addTemplate(data.template)

    router.push(`/admin/t/${data.template.id}`)
  } catch (error: any) {
    errorToast(error)
  } finally {
    loading.value = false
  }
}
</script>
