<template>
  <ClientOnly>
    <button
      class="bg-transparent px-2 py-1 focus:outline-transparent bg-white dark:bg-black text-black dark:text-white rounded-md hover:text-primary"
      @click="(e) => toggleDark()"
    >
      <carbon:moon class="h-5 w-5" v-if="isDark" />
      <carbon:sun class="h-5 w-5" v-else />
    </button>
  </ClientOnly>
</template>

<script setup lang="ts">
import { isDark, toggleDark } from '@/composables/dark'
</script>
