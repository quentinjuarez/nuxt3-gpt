<template>
  <div class="relative flex">
    <SideBar />

    <div class="w-full">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const store = useStore()

onMounted(async () => {
  try {
    const data = await $fetch<FetchResponse<{ templates: Template[] }>>('/api/templates/all')

    store.setTemplates(data.templates)
  } catch (error) {
    errorToast(error)
  }
})
</script>
