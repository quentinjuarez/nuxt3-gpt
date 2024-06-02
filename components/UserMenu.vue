<template>
  <UPopover class="w-full p-2">
    <UButton color="white" variant="ghost" class="w-full">
      <div class="flex items-center justify-start gap-3">
        <ItemAvatar :right="store.user?.id" :left="store.user?.email" :initials="store.initials" />

        <p class="text-lg font-bold">{{ store.user?.firstName }}</p>
      </div>
    </UButton>

    <template #panel>
      <div class="w-full space-y-2 p-4">
        <UButton to="/logout" class="w-full">Logout</UButton>
        <UButton to="/account" class="w-full">Account</UButton>
      </div>
    </template>
  </UPopover>
</template>

<script lang="ts" setup>
const store = useStore()
</script>
