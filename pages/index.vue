<template>
  <HomeView />
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: 'auth'
})
</script>
