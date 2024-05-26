<template>
  <UAvatar :src="src" />
</template>

<script setup lang="ts">
const props = defineProps<{
  right: string
  left: string
  initials?: string
}>()

const src = ref('')

onMounted(() => {
  src.value = avatarImg({
    right: props.right,
    left: props.left,
    initials: props.initials
  })
})
</script>
