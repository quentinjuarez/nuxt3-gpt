<template>
  <div class="space-y-2">
    <div v-if="data">
      <div class="space-y-2">
        <UButton
          v-for="conversation in data.conversations"
          :key="conversation.id"
          :to="`/t/${conversation.id}`"
          :color="focusId === conversation.id ? 'emerald' : 'white'"
          :variant="focusId === conversation.id ? 'outline' : 'ghost'"
          class="flex items-center gap-2"
        >
          <UAvatar :src="avatarSrc(conversation)" />
          <span>{{ conversation.templateId }}</span>
        </UButton>
      </div>

      <div v-if="!data.conversations.length" class="text-cool-500 text-center">
        {{ 'No conversations' }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const store = useStore()

const route = useRoute()

const focusId = computed(() => {
  return route.params.id
})

const avatarSrc = (c: Conversation) => {
  if (!mounted.value) return defaultSrc.value

  return avatarImg({
    right: c.templateId,
    left: c.templateId + '@bot.ia'
  })
}

const defaultSrc = ref('')

const mounted = ref(false)

onMounted(() => {
  mounted.value = true
  defaultSrc.value = avatarImg({
    right: 'default',
    left: 'bot.ia'
  })
})

const { pending, data, refresh } =
  useFetch<FetchResponse<{ conversations: Conversation[] }>>('/api/conversations/me')

watch(
  () => route.fullPath,
  () => {
    refresh()
  }
)
</script>
