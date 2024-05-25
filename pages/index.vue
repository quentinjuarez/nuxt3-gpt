<template>
  <HomeView />
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: 'auth',
  layout: 'default'
})
</script>
