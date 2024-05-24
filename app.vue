<template>
  <div
    class="text-cool-950 bg-cool-50 dark:bg-cool-950 dark:text-cool-50 min-h-screen w-full font-custom"
  >
    <NuxtPage />
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
