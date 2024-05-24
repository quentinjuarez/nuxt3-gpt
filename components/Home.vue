<template>
  <div class="mb-4 flex flex-col gap-6 rounded p-4">
    <h1 class="font-medium text-2xl">Serverless Functions</h1>
    <h2 class="text-base">
      Create a Serverless Functions in
      <a class="text-primary hover:underline" href="api/health" target="_blank"> server/api.ts </a>
    </h2>

    <code>{{ data }}</code>
  </div>
</template>

<script lang="ts" setup>
// fetch data from server/api
const { data } = await useAsyncData('/api/health', () => {
  return $fetch('/api/health')
})
</script>
