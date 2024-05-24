<template>
  <ClientOnly>
    <button
      class="rounded-md bg-white px-2 py-1 text-black hover:text-emerald-500 focus:outline-transparent dark:bg-black dark:text-white"
      @click="(e) => toggleDark()"
    >
      <carbon:moon v-if="isDark" class="size-5" />
      <carbon:sun v-else class="size-5" />
    </button>
  </ClientOnly>
</template>

<script setup lang="ts">
import { isDark, toggleDark } from '@/composables/dark'
</script>
