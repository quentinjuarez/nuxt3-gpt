<template>
  <LoadingView v-if="pending" />

  <div v-else-if="data" class="relative mx-auto flex h-full max-w-screen-lg flex-col px-6 pt-6">
    <div class="space-y-6">
      <div class="w-full">
        <h1 class="text-4xl font-bold">{{ data.conversation?.title }}</h1>
      </div>

      <TransitionGroup name="fade" tag="div" class="space-y-4">
        <div v-for="chat in data.conversation.chats" class="space-y-1" :key="chat.id">
          <div class="flex items-center gap-2">
            <ItemAvatar v-if="chat.senderId === 'bot'" right="Assistant" left="IA" initials="A" />
            <ItemAvatar
              v-else-if="store.user"
              :right="store.user.id"
              :left="store.user.email"
              :initials="store.initials"
            />
            <span class="font-bold">
              {{ chat.senderId === 'bot' ? 'Assistant' : store.user?.firstName }}
            </span>
          </div>
          <p class="pl-10">
            {{ chat.message }}
          </p>
        </div>
      </TransitionGroup>
    </div>

    <div
      class="dark:bg-cool-900 sticky inset-x-0 bottom-0 mt-auto flex items-center gap-2 bg-white p-6"
    >
      <UTextarea
        class="w-full"
        v-model="query"
        placeholder="Type your answer here"
        @keyup.meta.left="handleClick"
        autofocus
      >
      </UTextarea>
      <UButton @click="handleClick" square size="lg">
        <UIcon :name="loading ? 'i-heroicons-arrow-path-20-solid' : 'i-heroicons-arrow-up'" />
      </UButton>
    </div>
  </div>
  <ErrorView v-else v-bind="error" />
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const store = useStore()

const route = useRoute()

const { pending, data, error } = useFetch<
  FetchResponse<{ conversation: Conversation }>,
  FetchError
>(`/api/conversations/${route.params.id}`)

// CHATS
const query = ref('')
const loading = ref(false)

const handleClick = async () => {
  try {
    loading.value = true
    const response = await $fetch<FetchResponse<{ conversation: Conversation }>>(
      `/api/conversations/send`,
      {
        method: 'POST',
        body: {
          id: route.params.id,
          query: query.value
        }
      }
    )

    if (!data.value) return

    const lastChat = response.conversation.chats[response.conversation.chats.length - 1]

    data.value.conversation.chats.push(lastChat)
    query.value = ''
    scrollToBottom()
  } catch (error) {
    console.log('error', error)
    errorToast(error)
  } finally {
    loading.value = false
  }
}

const scrollToBottom = () => {
  nextTick(() => {
    console.log('scrolling to bottom')
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    })
  })
}

watch(pending, (newValue) => {
  if (!newValue) scrollToBottom()
})
</script>
