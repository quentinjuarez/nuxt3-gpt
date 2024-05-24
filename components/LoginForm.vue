<template>
  <div class="space-y-2">
    <h1 class="text-2xl font-bold">Login</h1>

    <UForm :validate="validate" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormGroup label="Email" name="email">
        <UInput v-model="state.email" />
      </UFormGroup>

      <UFormGroup label="Password" name="password">
        <UInput v-model="state.password" type="password" />
      </UFormGroup>

      <UButton type="submit" block :loading="loading">Login</UButton>
    </UForm>

    <div class="flex items-center justify-center">
      <span class="whitespace-nowrap">Don't have an account?</span>
      <UButton variant="link" :to="registerUrl">Register</UButton>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { FormError } from '#ui/types'
import { validateEmail, validatePassword } from '~/server/utils/validation'

const state = reactive({
  email: undefined,
  password: undefined
})

const store = useStore()

const router = useRouter()
const route = useRoute()

const validate = (state: any): FormError[] => {
  const errors = []
  if (!state.email) errors.push({ path: 'email', message: 'Required' })
  else if (!validateEmail(state.email)) errors.push({ path: 'email', message: 'Invalid email' })
  if (!state.password) errors.push({ path: 'password', message: 'Required' })
  else if (!validatePassword(state.password))
    errors.push({ path: 'password', message: 'Password must be at least 8 characters long' })
  return errors
}

async function onSubmit() {
  await login()
}

const toast = useToast()

const loading = ref(false)

const login = async () => {
  loading.value = true

  const { data, error } = await useFetch<
    {
      user: User
    },
    FetchError
  >('/api/login', {
    method: 'POST',
    body: {
      email: state.email,
      password: state.password
    }
  })

  loading.value = false

  if (error.value) {
    return toast.add({
      id: 'login-error',
      title: error.value.statusMessage,
      description: error.value.data.message,
      timeout: 5000,
      color: 'red'
    })
  }

  if (data.value) {
    store.login(data.value.user)

    const next = route.query.next as string | undefined

    return router.push(next || '/')
  }
}

const registerUrl = computed(() => {
  return {
    name: 'register',
    query: { next: route.query.next }
  }
})
</script>
