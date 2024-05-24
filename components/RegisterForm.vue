<template>
  <div class="space-y-2">
    <h1 class="text-2xl font-bold">Register</h1>

    <UForm :validate="validate" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormGroup label="First Name" name="firstName">
        <UInput v-model="state.firstName" />
      </UFormGroup>

      <UFormGroup label="Last Name" name="lastName">
        <UInput v-model="state.lastName" />
      </UFormGroup>

      <UFormGroup label="Email" name="email">
        <UInput v-model="state.email" />
      </UFormGroup>

      <UFormGroup label="Password" name="password">
        <UInput v-model="state.password" type="password" />
      </UFormGroup>

      <UButton type="submit" block :loading="loading">Register</UButton>
    </UForm>
    <div class="flex items-center justify-center">
      <span class="whitespace-nowrap">Already have an account?</span>
      <UButton variant="link" :to="loginUrl">Login</UButton>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'
import { validateEmail, validatePassword } from '~/server/utils/validation'

const state = reactive({
  firstName: undefined,
  lastName: undefined,
  email: undefined,
  password: undefined
})

const store = useStore()

const router = useRouter()
const route = useRoute()

const toast = useToast()

const validate = (state: any): FormError[] => {
  const errors = []
  if (!state.firstName) errors.push({ path: 'firstName', message: 'Required' })
  if (!state.lastName) errors.push({ path: 'lastName', message: 'Required' })
  if (!state.email) errors.push({ path: 'email', message: 'Required' })
  else if (!validateEmail(state.email)) errors.push({ path: 'email', message: 'Invalid email' })
  if (!state.password) errors.push({ path: 'password', message: 'Required' })
  else if (!validatePassword(state.password))
    errors.push({ path: 'password', message: 'Password must be at least 8 characters long' })
  return errors
}

async function onSubmit(event: FormSubmitEvent<any>) {
  await register()
}

const loading = ref(false)

const register = async () => {
  loading.value = true

  const { data, error } = await useFetch<
    FetchResponse<{
      user: User
    }>,
    FetchError
  >('/api/auth/register', {
    method: 'POST',
    body: {
      firstName: state.firstName,
      lastName: state.lastName,
      email: state.email,
      password: state.password
    }
  })

  loading.value = false

  if (error.value) {
    return toast.add({
      id: 'register-error',
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

const loginUrl = computed(() => {
  return {
    name: 'login',
    query: { next: route.query.next }
  }
})
</script>
