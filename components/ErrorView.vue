<template>
  <div>
    <h1>{{ props.data?.statusCode }}: {{ props.data?.message }}</h1>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  data?: {
    message: string
    statusCode: number
  }
}>()
</script>
