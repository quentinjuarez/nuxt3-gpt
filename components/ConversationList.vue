<template>
  <div>
    <div v-for="c in store.conversations" :key="c.id" class="flex items-center gap-2">
      <UAvatar :src="avatarSrc(c)" />
      <span>{{ c.templateId }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const store = useStore()

const avatarSrc = (c: Conversation) => {
  return avatarImg({
    right: c.templateId,
    left: c.templateId + '@bot.ia'
  })
}
</script>
