<template>
  <div
    class="text-cool-950 dark:bg-cool-900 dark:text-cool-50 min-h-screen w-full bg-white font-custom"
  >
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <UNotifications />
  </div>
</template>

<script setup lang="ts">
const keyListener = (event: KeyboardEvent) => {
  if (event.key === 'L' && (event.ctrlKey || event.metaKey) && event.shiftKey) {
    toggleDark()
  }
}

onMounted(() => {
  window.addEventListener('keydown', keyListener)
})

onUnmounted(() => {
  window.removeEventListener('keydown', keyListener)
})
</script>
