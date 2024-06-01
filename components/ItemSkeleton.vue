<template>
  <div class="flex w-full items-center gap-2 px-2.5 py-1.5">
    <USkeleton class="h-8 w-8" :ui="{ rounded: 'rounded-full' }" />
    <USkeleton class="h-5" :class="[randomWidth]" :ui="{ rounded: 'rounded' }" />
  </div>
</template>

<script setup lang="ts">
const widths = ['w-2/3', 'w-1/2', 'w-3/4']
const randomWidth = widths[Math.floor(Math.random() * widths.length)]
</script>
