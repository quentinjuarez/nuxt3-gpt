<template>
  <LoadingView v-if="pending" />

  <div v-else-if="data">
    <div
      class="border-cool-200 dark:border-cool-700 flex items-center justify-end gap-4 border-b p-2"
    >
      <div class="flex items-center gap-1 text-sm">
        <span
          :class="{
            'text-cool-500': !published,
            'text-emerald-500': published
          }"
        >
          {{ published ? 'Published' : 'Draft' }}
        </span>
        <UToggle v-model="published" @change="updateDraft" />
      </div>

      <UButton @click="deleteTemplate">
        <UIcon name="i-heroicons-trash" />
        <span>Delete</span>
      </UButton>
    </div>

    <div class="w-full max-w-screen-sm space-y-2 p-6">
      <h1 class="text-4xl font-bold">{{ data.template.title }}</h1>

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
  middleware: 'auth'
})

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

    router.push('/')
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

// DRAFT
const published = ref(false)

const updateDraft = async () => {
  try {
    const response = await $fetch<FetchResult<{ template: Template }>>(
      `/api/templates/${route.params.id}`,
      {
        method: 'PUT',
        body: {
          draft: !published.value
        }
      }
    )

    if (!data.value || !response) return

    data.value.template = response.template
  } catch (error) {
    errorToast(error)
  }
}

// Initialize updateState
watch(
  data,
  () => {
    if (data.value?.template) {
      console.log('data.value.template.draft', data.value.template.draft)

      published.value = !data.value.template.draft
    }
  },
  { immediate: true }
)
</script>
