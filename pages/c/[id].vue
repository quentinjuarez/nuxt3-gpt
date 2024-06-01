<template>
  <LoadingView v-if="pending" />

  <div v-else-if="data" class="relative mx-auto flex h-full max-w-screen-xl flex-col p-6">
    <div>
      <div class="w-full">
        <h1 class="text-4xl font-bold">{{ data.conversation.title }}</h1>
      </div>

      <div class="space-y-2">
        <div v-for="chat in data.conversation.chats" class="space-y-2">
          <div class="flex items-center gap-2">
            <ItemAvatar v-if="chat.senderId === 'bot'" right="Assistant" left="IA" initials="A" />
            <ItemAvatar
              v-else
              :right="store.user?.id"
              :left="store.user?.email"
              :initials="store.initials"
            />
            <span class="font-bold">{{
              chat.senderId === 'bot' ? 'Assistant' : store.user?.firstName
            }}</span>
          </div>
          <p class="pl-10">
            {{ chat.message }}
          </p>
        </div>
        <div v-for="chat in data.conversation.chats" class="space-y-2">
          <div class="flex items-center gap-2">
            <ItemAvatar v-if="chat.senderId === 'bot'" right="Assistant" left="IA" initials="A" />
            <ItemAvatar
              v-else
              :right="store.user?.id"
              :left="store.user?.email"
              :initials="store.initials"
            />
            <span class="font-bold">{{
              chat.senderId === 'bot' ? 'Assistant' : store.user?.firstName
            }}</span>
          </div>
          <p class="pl-10">
            {{ chat.message }}
          </p>
        </div>
        <div v-for="chat in data.conversation.chats" class="space-y-2">
          <div class="flex items-center gap-2">
            <ItemAvatar v-if="chat.senderId === 'bot'" right="Assistant" left="IA" initials="A" />
            <ItemAvatar
              v-else
              :right="store.user?.id"
              :left="store.user?.email"
              :initials="store.initials"
            />
            <span class="font-bold">{{
              chat.senderId === 'bot' ? 'Assistant' : store.user?.firstName
            }}</span>
          </div>
          <p class="pl-10">
            {{ chat.message }}
          </p>
        </div>
        <div v-for="chat in data.conversation.chats" class="space-y-2">
          <div class="flex items-center gap-2">
            <ItemAvatar v-if="chat.senderId === 'bot'" right="Assistant" left="IA" initials="A" />
            <ItemAvatar
              v-else
              :right="store.user?.id"
              :left="store.user?.email"
              :initials="store.initials"
            />
            <span class="font-bold">{{
              chat.senderId === 'bot' ? 'Assistant' : store.user?.firstName
            }}</span>
          </div>
          <p class="pl-10">
            {{ chat.message }}
          </p>
        </div>
        <div v-for="chat in data.conversation.chats" class="space-y-2">
          <div class="flex items-center gap-2">
            <ItemAvatar v-if="chat.senderId === 'bot'" right="Assistant" left="IA" initials="A" />
            <ItemAvatar
              v-else
              :right="store.user?.id"
              :left="store.user?.email"
              :initials="store.initials"
            />
            <span class="font-bold">{{
              chat.senderId === 'bot' ? 'Assistant' : store.user?.firstName
            }}</span>
          </div>
          <p class="pl-10">
            {{ chat.message }}
          </p>
        </div>
        <div v-for="chat in data.conversation.chats" class="space-y-2">
          <div class="flex items-center gap-2">
            <ItemAvatar v-if="chat.senderId === 'bot'" right="Assistant" left="IA" initials="A" />
            <ItemAvatar
              v-else
              :right="store.user?.id"
              :left="store.user?.email"
              :initials="store.initials"
            />
            <span class="font-bold">{{
              chat.senderId === 'bot' ? 'Assistant' : store.user?.firstName
            }}</span>
          </div>
          <p class="pl-10">
            {{ chat.message }}
          </p>
        </div>
        <div v-for="chat in data.conversation.chats" class="space-y-2">
          <div class="flex items-center gap-2">
            <ItemAvatar v-if="chat.senderId === 'bot'" right="Assistant" left="IA" initials="A" />
            <ItemAvatar
              v-else
              :right="store.user?.id"
              :left="store.user?.email"
              :initials="store.initials"
            />
            <span class="font-bold">{{
              chat.senderId === 'bot' ? 'Assistant' : store.user?.firstName
            }}</span>
          </div>
          <p class="pl-10">
            {{ chat.message }}
          </p>
        </div>
      </div>
    </div>

    <div class="dark:bg-cool-900 sticky inset-x-0 bottom-0 flex items-center gap-2 bg-white p-6">
      <UTextarea
        class="w-full"
        v-model="query"
        placeholder="Type your answer here"
        @keyup.meta.left="handleClick"
        autofocus
      >
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

const handleClick = async () => {
  try {
    const data = await $fetch<FetchResponse<{ conversation: Conversation }>>(
      `/api/conversations/send`,
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
