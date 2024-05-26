<template>
  <div class="space-y-2">
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
          <CoolAvatar :right="template.title" :left="template.id" :initials="template.title[0]" />
          <span>{{ template.title }}</span>
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
      <CoolAvatar right="default" left="default" initials="+" />
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
</script>
