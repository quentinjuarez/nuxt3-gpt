<template>
  <div class="mb-4 flex flex-col gap-6 rounded p-4">
    <UAvatar :src="avatarSrc" :imgClass="'object-contain'" />

    <div class="flex flex-col gap-2">
      <h1 class="text-2xl font-bold">Welcome back, {{ store.user?.firstName }}</h1>
      <p class="text-gray-500">Email: {{ store.user?.email }}</p>

      <UButton to="/logout">Logout</UButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
// const { data } = await useAsyncData('/api/me', () => {
//   return $fetch('/api/me')
// })

const store = useStore()

const avatarSrc = computed(() => {
  return store.user ? avatarImg(store.user) : undefined
})
</script>
