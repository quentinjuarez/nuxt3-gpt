<template>
  <HomeView />
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: ['auth', 'admin'],
  layout: 'default'
})
</script>
