<template>
  <LoadingView v-if="pending" />

  <div v-else-if="data">
    <div
      class="border-cool-200 dark:border-cool-700 flex items-center justify-end gap-4 border-b p-2"
    >
      <div class="flex items-center gap-1 text-sm">
        <span :class="published ? 'text-emerald-500' : 'text-cool-500'">
          {{ published ? 'Published' : 'Draft' }}
        </span>
        <UToggle v-model="published" @change="updatePublished" />
      </div>

      <UButton @click="deleteTemplate">
        <UIcon name="i-heroicons-trash" />
        <span>Delete</span>
      </UButton>
    </div>

    <div class="mx-auto flex h-full max-w-screen-lg flex-col justify-between space-y-6 p-6">
      <div v-if="!editTitle" class="flex items-center gap-2">
        <h1 class="text-4xl font-bold">{{ data.template.title }}</h1>

        <UButton @click="handleEditTitle" square>
          <UIcon name="i-heroicons-pencil" />
        </UButton>
      </div>
      <UForm
        v-else
        :validate="validate"
        :state="validateTitle"
        @submit="updateTitle"
        class="flex items-end gap-2"
      >
        <UFormGroup label="Title" name="title">
          <UInput v-model="titleState.title" autofocus />
        </UFormGroup>

        <div class="flex items-center gap-2 pb-px">
          <UButton size="md" color="white" @click="editTitle = !editTitle" square>
            <UIcon name="i-heroicons-x-mark" />
          </UButton>

          <UButton size="md" type="submit" :loading="loading" @click="updateTitle" square>
            <UIcon :name="loading ? 'i-heroicons-arrow-path-20-solid' : 'i-heroicons-check'" />
          </UButton>
        </div>
      </UForm>

      <div class="border-cool-200 dark:border-cool-700 space-y-2 border-b pb-4">
        <div v-for="(step, index) in data.template.steps" :key="step.id" class="space-y-2">
          <UForm
            :validate="validateUpdate"
            :state="updateState"
            class="space-y-2"
            @submit="updateStep"
          >
            <UFormGroup :label="`Step ${index + 1}`" :name="'step-' + step.id">
              <template #hint>
                <div v-if="updateState.stepId === step.id" class="flex items-center gap-2">
                  <UButton color="white" @click="handleCancel"> Cancel </UButton>
                  <UButton type="submit" :loading="updateLoading" @click="updateStep">
                    Update
                  </UButton>
                </div>

                <UButton v-else @click="handleEdit(step.id)">Edit</UButton>
              </template>
              <template #default>
                <UTextarea
                  v-if="updateState.stepId === step.id"
                  placeholder="Update instruction..."
                  autoresize
                  v-model="updateState.instruction"
                  autofocus
                />
                <UTextarea
                  v-else
                  placeholder="Update instruction..."
                  autoresize
                  v-model="step.instruction"
                  disabled
                />
              </template>
            </UFormGroup>
          </UForm>
        </div>

        <div v-if="!data.template.steps.length" class="text-cool-500">No steps</div>
      </div>

      <div>
        <UForm :validate="validate" :state="state" class="space-y-2" @submit="addStep">
          <UFormGroup label="New step" name="instruction">
            <UTextarea v-model="state.instruction" placeholder="New instruction..." autoresize />
          </UFormGroup>

          <UButton type="submit" :loading="loading" @click="addStep">Add step</UButton>
        </UForm>
      </div>
    </div>
  </div>
  <ErrorView v-else v-bind="error" />
</template>

<script setup lang="ts">
import type { FormError } from '#ui/types'

definePageMeta({
  middleware: ['auth', 'admin'],
  layout: 'default'
})

const store = useStore()

const route = useRoute()
const router = useRouter()

const { pending, data, error } = useFetch<FetchResponse<{ template: Template }>, FetchError>(
  `/api/templates/${route.params.id}`
)

const deleteTemplate = async () => {
  try {
    await $fetch<FetchResult<{}>>(`/api/templates/${route.params.id}`, {
      method: 'DELETE'
    })

    store.deleteTemplate(route.params.id as string)

    router.push('/admin')
  } catch (error) {
    errorToast(error)
  }
}

// NEW STEP
const state = reactive({
  instruction: undefined
})

const validate = (state: any): FormError[] => {
  const errors = []
  if (!state.instruction) errors.push({ path: 'instruction', message: 'Required' })

  return errors
}

const loading = ref(false)

const addStep = async () => {
  try {
    loading.value = true
    const response = await $fetch<FetchResult<{ template: Template }>>(
      `/api/templates/${route.params.id}/steps`,
      {
        method: 'POST',
        body: {
          instruction: state.instruction
        }
      }
    )

    if (!data.value || !response) return

    data.value.template = response.template

    state.instruction = undefined
  } catch (error) {
    errorToast(error)
  } finally {
    loading.value = false
  }
}

// UPDATE STEP
const updateState = reactive<{
  stepId: string
  instruction: string
}>({ stepId: '', instruction: '' })

const updateLoading = ref(false)

const validateUpdate = (state: any): FormError[] => {
  const errors = []
  if (!state.instruction) errors.push({ path: 'instruction', message: 'Required' })

  return errors
}

const handleEdit = (stepId: string) => {
  updateState.stepId = stepId
  updateState.instruction = data.value?.template.steps.find((step) => step.id === stepId)
    ?.instruction as string
}

const handleCancel = () => {
  updateState.stepId = ''
  updateState.instruction = ''
}

const updateStep = async () => {
  try {
    updateLoading.value = true

    const stepId = updateState.stepId
    const response = await $fetch<FetchResult<{ template: Template }>>(
      `/api/templates/${route.params.id}/steps/${stepId}`,
      {
        method: 'PUT',
        body: {
          instruction: updateState.instruction
        }
      }
    )

    if (!data.value || !response) return

    data.value.template = response.template

    updateState.stepId = ''
  } catch (error) {
    errorToast(error)
  } finally {
    updateLoading.value = false
  }
}

// PUBLISHED
const published = ref(false)

const updatePublished = async () => {
  try {
    const response = await $fetch<FetchResult<{ template: Template }>>(
      `/api/templates/${route.params.id}`,
      {
        method: 'PUT',
        body: {
          published: published.value
        }
      }
    )

    if (!data.value || !response) return

    data.value.template = response.template
    store.updateTemplate(response.template)
  } catch (error) {
    errorToast(error)
  }
}

// TITLE
const titleState = reactive({
  title: ''
})
const editTitle = ref(false)
const loadingTitle = ref(false)

const validateTitle = (state: any): FormError[] => {
  const errors = []
  if (!state.title) errors.push({ path: 'title', message: 'Required' })

  return errors
}

const handleEditTitle = () => {
  editTitle.value = true
  titleState.title = data.value?.template.title as string
}

const updateTitle = async () => {
  try {
    loadingTitle.value = true
    const response = await $fetch<FetchResult<{ template: Template }>>(
      `/api/templates/${route.params.id}`,
      {
        method: 'PUT',
        body: {
          title: titleState.title
        }
      }
    )

    if (!data.value || !response) return

    data.value.template = response.template
    editTitle.value = false
    store.updateTemplate(response.template)
  } catch (error) {
    errorToast(error)
  } finally {
    loadingTitle.value = false
  }
}

// Initialize updateState
watch(
  data,
  () => {
    if (data.value?.template) {
      published.value = data.value.template.published
    }
  },
  { immediate: true }
)
</script>
