<template>
  <div></div>
</template>

<script setup lang="ts">
const store = useStore()

const router = useRouter()

await useAsyncData('/api/logout', async () => {
  store.logout()
  await $fetch('/api/logout')

  router.push('/')
})
</script>
