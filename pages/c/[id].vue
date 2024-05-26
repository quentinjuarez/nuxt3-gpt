<template>
  <div></div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const route = useRoute()

const { pending, data, error } = useFetch<FetchResponse<{ template: Template }>, FetchError>(
  `/api/conversations/${route.params.id}`
)
</script>
