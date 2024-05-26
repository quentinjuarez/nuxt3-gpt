<template>
  <div class="bg-cool-100 dark:bg-cool-950 sticky bottom-0 top-0 h-screen w-72 flex-none">
    <div class="flex h-full flex-col justify-between">
      <div class="">
        <AppLogo />
        <UTabs
          v-if="store.user?.isAdmin"
          :items="items"
          class="w-full p-2"
          :modelValue="modelValue"
          @change="handleChange"
        >
          <template #item="{ item }">
            <TrainerSideBar v-if="item.key === 'trainer'" />
            <AdminSideBar v-else-if="item.key === 'admin'" />
          </template>
        </UTabs>

        <div v-else class="w-full p-2">
          <TrainerSideBar />
        </div>
      </div>

      <UserMenu />
    </div>
  </div>
</template>

<script setup lang="ts">
const store = useStore()

const items = [
  {
    label: 'Trainer',
    key: 'trainer'
  },
  {
    label: 'Administrator',
    key: 'admin'
  }
]
const route = useRoute()
const router = useRouter()

const modelValue = ref(0)

onMounted(() => {
  modelValue.value = route.path.includes('admin') ? 1 : 0
})

// watchEffect(() => {
//   defaultIndex.value = window.location.href.includes('admin') ? 1 : 0
// })

const handleChange = (index: number) => {
  modelValue.value = index
  if (index === 0) {
    router.push('/')
  } else {
    router.push('/admin')
  }
}
</script>
