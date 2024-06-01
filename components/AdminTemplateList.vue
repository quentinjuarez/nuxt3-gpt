<template>
  <div class="space-y-2">
    <div v-if="!store.templatesLoading">
      <div>
        <div class="space-y-2">
          <UButton
            v-for="template in store.templates"
            :key="template.id"
            :to="`/admin/t/${template.id}`"
            :color="focusId === template.id ? 'emerald' : 'white'"
            :variant="focusId === template.id ? 'outline' : 'ghost'"
            class="flex items-center gap-2"
          >
            <ItemAvatar :right="template.title" :left="template.id" :initials="template.title[0]" />
            <span class="truncate">{{ template.title }}</span>

            <div
              class="ml-auto h-2 w-2 flex-none rounded-full"
              :class="template.published ? 'bg-emerald-500' : 'bg-cool-500'"
            ></div>
          </UButton>
        </div>

        <div v-if="!store.templates.length" class="text-cool-500 text-center">
          {{ 'No templates' }}
        </div>
      </div>

      <UButton
        v-if="store.user?.isAdmin"
        color="white"
        variant="ghost"
        class="flex w-full items-center gap-2"
        to="/admin/t/new"
      >
        <ItemAvatar right="default" left="default" initials="+" />
        <span>New template</span>
      </UButton>
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
    store.fetchTemplates(true)
  } catch (error) {
    errorToast(error)
  }
})
</script>
