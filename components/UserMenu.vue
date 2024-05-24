<template>
  <UPopover class="w-full p-2">
    <UButton color="white" variant="ghost" class="w-full">
      <div class="flex items-center justify-start gap-3">
        <UAvatar :src="avatarSrc" :imgClass="'object-contain'" />

        <p class="text-lg font-bold">{{ store.user?.firstName }}</p>
      </div>
    </UButton>

    <template #panel>
      <div class="w-full p-4">
        <UButton to="/logout" class="w-full">Logout</UButton>
      </div>
    </template>
  </UPopover>
</template>

<script lang="ts" setup>
const store = useStore()

const avatarSrc = computed(() => {
  return store.user ? avatarImg(store.user) : undefined
})
</script>
