<template>
  <UForm :validate="validate" :state="state" class="space-y-4" @submit="onSubmit">
    <UFormGroup label="Email" name="email">
      <UInput v-model="state.email" />
    </UFormGroup>

    <UFormGroup label="Password" name="password">
      <UInput v-model="state.password" type="password" />
    </UFormGroup>

    <UButton type="submit" block> Submit </UButton>
  </UForm>
</template>
<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'
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

const login = async () => {
  try {
    const { data, error } = await useFetch<
      {
        user: User
        token: string
      },
      {
        statusCode: number
        message: string
      }
    >('/api/login', {
      method: 'POST',
      body: {
        email: state.email,
        password: state.password
      }
    })

    if (error.value) {
      return toast.add({
        id: 'login-error',
        title: 'Error',
        description: error.value.message,
        timeout: 5000
      })
    }
    if (data.value) {
      store.login(data.value.user, data.value.token)

      const next = route.query.next as string | undefined

      return router.push(next || '/')
    }
  } catch (err) {
    console.error(err)
  }
}

const toast = useToast()
</script>
