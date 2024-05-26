<template>
  <div class="space-y-2">
    <div class="space-y-2">
      <UButton
        v-for="template in store.templates"
        :key="template.id"
        :color="'white'"
        :variant="'ghost'"
        class="flex w-full items-center gap-2"
        :to="`/t/${template.id}`"
      >
        <CoolAvatar :right="template.title" :left="template.id" :initials="template.title[0]" />
        <span>{{ template.title }}</span>
      </UButton>
    </div>

    <div v-if="!store.templates.length" class="text-cool-500 text-center">
      {{ 'No templates' }}
    </div>
  </div>
</template>

<script setup lang="ts">
const store = useStore()
</script>
