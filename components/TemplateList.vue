<template>
  <div class="space-y-2 p-2">
    <div v-if="data">
      <div class="space-y-2">
        <UButton
          v-for="template in data.templates"
          :key="template.id"
          :to="`/t/${template.id}`"
          :color="focusId === template.id ? 'emerald' : 'white'"
          :variant="focusId === template.id ? 'outline' : 'ghost'"
          class="flex items-center gap-2"
        >
          <UAvatar :src="avatarSrc(template)" />
          <span>{{ template.title }}</span>
        </UButton>
      </div>

      <div v-if="!data.templates.length" class="text-cool-500 text-center">
        {{ 'No templates' }}
      </div>
    </div>

    <UButton
      v-if="store.user?.isAdmin"
      color="white"
      variant="ghost"
      class="flex w-full items-center gap-2"
      to="/t/new"
    >
      <UAvatar :src="defaultSrc" />
      <span>New template</span>
    </UButton>
  </div>
</template>

<script setup lang="ts">
const store = useStore()

const route = useRoute()

const focusId = computed(() => {
  return route.params.id
})

const avatarSrc = (c: Template) => {
  if (!mounted.value) return defaultSrc.value

  return avatarImg({
    right: c.title,
    left: c.title + '@bot.ia'
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
  useFetch<FetchResponse<{ templates: Template[] }>>('/api/templates/all')

watch(
  () => route.fullPath,
  () => {
    refresh()
  }
)
</script>
