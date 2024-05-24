<template>
  <HomeView />
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: 'auth'
})

const store = useStore()

onMounted(() => {
  fetchConversations()
})

const fetchConversations = async () => {
  const data = await $fetch<FetchResult<{ conversations: Conversation[] }>>('/api/conversations/me')

  if ('conversations' in data) {
    store.setConversations(data.conversations)
  }
}
</script>
