<template>
  <div class="flex w-full items-center gap-2 px-2.5 py-1.5">
    <USkeleton class="h-8 w-8" :ui="{ rounded: 'rounded-full' }" />
    <USkeleton class="h-5" :class="[dynamicWidth]" :ui="{ rounded: 'rounded' }" />
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    index?: number
  }>(),
  {
    index: 0
  }
)

const WIDTH = ['w-2/3', 'w-1/2', 'w-3/4']
const dynamicWidth = ref(WIDTH[props.index % WIDTH.length])
</script>
