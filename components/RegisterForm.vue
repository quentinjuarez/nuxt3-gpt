<template>
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

    <UButton type="submit" block> Submit </UButton>
  </UForm>
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

const register = async () => {
  try {
    const { data, error } = await useFetch('/api/register', {
      method: 'POST',
      body: {
        firstName: state.firstName,
        lastName: state.lastName,
        email: state.email,
        password: state.password
      }
    })

    if (error.value) {
      console.error(error.value)
    } else {
      console.log('User registered:', data.value)
    }
  } catch (err) {
    console.error(err)
  }
}

const toast = useToast()
</script>
