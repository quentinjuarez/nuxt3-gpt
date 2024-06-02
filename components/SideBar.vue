<template>
  <div class="bg-cool-50 dark:bg-cool-950 sticky bottom-0 top-0 h-screen w-72 flex-none">
    <div class="flex h-full flex-col justify-between">
      <div class="">
        <AppLogo />
        <div v-if="store.user?.isAdmin" class="w-full">
          <UTabs class="p-2" :items="items" :modelValue="modelValue" @change="handleChange">
          </UTabs>

          <div class="max-h-[calc(100vh-188px)] overflow-auto p-2">
            <TrainerSideBar v-if="!modelValue" />
            <AdminSideBar v-else />
          </div>
        </div>

        <div v-else class="max-h-[calc(100vh-124px)] w-full overflow-auto p-2">
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

const mounted = ref(false)
const modelValue = ref(0)

onMounted(() => {
  modelValue.value = route.path.includes('admin') ? 1 : 0
  nextTick(() => {
    mounted.value = true
  })
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
