<template>
  <LoadingView v-if="pending" />

  <div v-else-if="data" class="mx-auto flex h-full max-w-screen-xl flex-col justify-between p-6">
    <UTable :columns="columns" :rows="data.users.items" />

    <div class="flex justify-end border-t border-gray-200 px-3 py-3.5 dark:border-gray-700">
      <UPagination v-model="page" :page-count="pageCount" :total="data.users.total" />
    </div>
  </div>
  <ErrorView v-else v-bind="error" />
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth', 'admin'],
  layout: 'default'
})

const page = ref(1)
const pageCount = ref(1)

const columns = [
  {
    key: 'id',
    label: 'ID'
  },
  {
    key: 'firstName',
    label: 'firstName'
  },
  {
    key: 'lastName',
    label: 'lastName'
  },
  {
    key: 'email',
    label: 'Email'
  },
  {
    key: 'isAdmin',
    label: 'Admin'
  }
]

const store = useStore()

const route = useRoute()
const router = useRouter()

const { pending, data, error } = useFetch<FetchResponse<{ users: Pagination<User> }>, FetchError>(
  `/api/users`
)

watch(
  () => {
    if (data.users) {
      pageCount.value = data.users.pageCount
    }
  },
  { immediate: true }
)
</script>
