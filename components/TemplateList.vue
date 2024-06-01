<template>
  <div class="space-y-2">
    <div v-if="!store.templatesLoading">
      <div class="space-y-2">
        <UButton
          v-for="template in store.templates"
          :key="template.id"
          :color="focusId === template.id ? 'emerald' : 'white'"
          :variant="focusId === template.id ? 'outline' : 'ghost'"
          class="flex w-full items-center gap-2"
          :to="`/t/${template.id}`"
        >
          <ItemAvatar :right="template.title" :left="template.id" :initials="template.title[0]" />
          <span class="truncate">{{ template.title }}</span>
        </UButton>
      </div>

      <div v-if="!store.templates.length" class="text-cool-500 text-center">
        {{ 'No templates' }}
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

const focusId = computed(() => {
  return route.params.id
})

onMounted(() => {
  try {
    store.fetchTemplates()
  } catch (error) {
    errorToast(error)
  }
})
</script>
