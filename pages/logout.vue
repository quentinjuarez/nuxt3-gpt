<template>
  <div></div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'empty'
})

const store = useStore()

const router = useRouter()

await useAsyncData('/api/auth/logout', async () => {
  store.logout()
  await $fetch('/api/auth/logout')

  router.push('/')
})
</script>
