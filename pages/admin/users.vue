<template>
  <LoadingView v-if="pending" />

  <div v-else-if="data" class="mx-auto flex h-full max-w-screen-lg flex-col justify-between p-6">
    <UCard>
      <template #header>
        <p class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
          Users administration
        </p>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage users here.</p>
      </template>

      <div class="h-[70vh] overflow-y-auto">
        <UTable :columns="columns" :rows="data.users.items" />
      </div>

      <template #footer>
        <div class="flex items-center justify-center">
          <UPagination v-model="page" :page-count="pageCount" :total="data.users.total" />
        </div>
      </template>
    </UCard>
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
