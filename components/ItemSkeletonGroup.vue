<template>
  <div class="space-y-2">
    <ItemSkeleton v-for="(_, index) in props.count" :key="index" :index="index" />
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    count?: number
  }>(),
  {
    count: 3
  }
)
</script>
