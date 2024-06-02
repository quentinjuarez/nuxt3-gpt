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
  store.setUser(undefined)
  await $fetch('/api/auth/logout')

  router.push('/')
})
</script>
