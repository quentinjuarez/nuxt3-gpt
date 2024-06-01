<template>
  <div class="space-y-2">
    <div v-if="!store.conversationsLoading">
      <transition-group name="fade" tag="div" class="space-y-2">
        <div v-for="conversation in store.conversations" :key="conversation.id">
          <UButton
            :to="`/c/${conversation.id}`"
            :color="focusId === conversation.id ? 'emerald' : 'white'"
            :variant="focusId === conversation.id ? 'outline' : 'ghost'"
            class="group relative flex items-center gap-2"
          >
            <ItemAvatar
              :right="conversation.title"
              :left="conversation.id"
              :initials="conversation.title[0]"
            />
            <span class="truncate">{{ conversation.title }}</span>

            <UButton
              class="absolute right-2.5 opacity-0 transition-opacity group-hover:opacity-100"
              color="red"
              @click.prevent.stop="deleteConversation(conversation.id)"
              square
            >
              <UIcon :name="loading ? 'i-heroicons-refresh' : 'i-heroicons-trash'" />
            </UButton>
          </UButton>
        </div>
      </transition-group>

      <div v-if="!store.conversations.length" class="text-cool-500 text-center">
        {{ 'No conversations' }}
      </div>
    </div>
    <div v-else class="space-y-2">
      <ItemSkeleton />
      <ItemSkeleton />
      <ItemSkeleton />
    </div>
  </div>
</template>

<script setup lang="ts">
const store = useStore()

const route = useRoute()
const router = useRouter()

const focusId = computed(() => {
  return route.params.id
})

onMounted(() => {
  try {
    store.fetchConversations()
  } catch (error) {
    errorToast(error)
  }
})

const loading = ref(false)

const deleteConversation = async (id: string) => {
  try {
    loading.value = true
    await $fetch<FetchResult<{}>>(`/api/conversations/${id}`, {
      method: 'DELETE'
    })

    store.deleteConversation(id)

    router.push('/')
  } catch (error) {
    errorToast(error)
  } finally {
    loading.value = false
  }
}
</script>
