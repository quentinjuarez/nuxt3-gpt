<template>
  <LoadingView v-if="pending" />

  <div v-else-if="data" class="mx-auto flex h-full max-w-screen-xl flex-col justify-between p-6">
    <div class="w-full space-y-2">
      <h1 class="text-4xl font-bold">{{ data.template.title }}</h1>
    </div>

    <div class="space-y-2">
      <div class="flex items-center gap-2">
        <ItemAvatar right="Assistant" left="IA" initials="A" />
        <span class="font-bold">Assistant</span>
      </div>
      <p class="pl-10" v-if="data.template.steps.length">
        {{ data.template.steps[0].instruction }}
      </p>
    </div>

    <div class="flex items-center gap-2">
      <UTextarea
        class="w-full"
        v-model="query"
        placeholder="Type your answer here"
        @keyup.meta.left="handleClick"
        autofocus
      >
        <template #trailing>
          <UButton @click="handleClick" square size="lg">
            <UIcon name="i-heroicons-arrow-up" />
          </UButton>
        </template>
      </UTextarea>
      <UButton @click="handleClick" square size="lg">
        <UIcon name="i-heroicons-arrow-up" />
      </UButton>
    </div>
  </div>
  <ErrorView v-else v-bind="error" />
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

const store = useStore()

const route = useRoute()
const router = useRouter()

const { pending, data, error } = useFetch<FetchResponse<{ template: Template }>, FetchError>(
  `/api/templates/${route.params.id}`
)

const query = ref('')

const handleClick = async () => {
  try {
    const data = await $fetch<FetchResponse<{ conversation: Conversation }>>(
      `/api/conversations/create`,
      {
        method: 'POST',
        body: {
          templateId: route.params.id,
          query: query.value
        }
      }
    )

    store.addConversation(data.conversation)
    router.push(`/c/${data.conversation.id}`)
  } catch (error) {
    errorToast(error)
  }
}
</script>
