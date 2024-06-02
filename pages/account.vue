<template>
  <div class="mx-auto flex h-full max-w-screen-lg flex-col p-6">
    <UTabs :items="items" class="w-full">
      <template #item="{ item }">
        <UCard @submit.prevent="() => onSubmit(item.key)">
          <template #header>
            <p class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              {{ item.label }}
            </p>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {{ item.description }}
            </p>
          </template>

          <UForm
            v-if="item.key === 'account'"
            :validate="validateAccount"
            :state="accountForm"
            class="space-y-4"
          >
            <UFormGroup label="First Name" name="firstName">
              <UInput v-model="accountForm.firstName" required />
            </UFormGroup>
            <UFormGroup label="Last Name" name="lastName">
              <UInput v-model="accountForm.lastName" required />
            </UFormGroup>
          </UForm>

          <UForm
            v-else-if="item.key === 'password'"
            :validate="validateNewPassword"
            :state="passwordForm"
            class="space-y-4"
          >
            <UFormGroup label="Current Password" name="currentPassword" required>
              <UInput
                v-model="passwordForm.currentPassword"
                :type="showCurrentPassword ? 'text' : 'password'"
                required
              >
                <template #trailing>
                  <UButton
                    class="pointer-events-auto"
                    square
                    variant="ghost"
                    @click.stop="showCurrentPassword = !showCurrentPassword"
                  >
                    <UIcon
                      :name="showCurrentPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
                    />
                  </UButton>
                </template>
              </UInput>
            </UFormGroup>
            <UFormGroup label="New Password" name="newPassword" required>
              <UInput
                v-model="passwordForm.newPassword"
                :type="showNewPassword ? 'text' : 'password'"
                required
              >
                <template #trailing>
                  <UButton
                    class="pointer-events-auto"
                    square
                    variant="ghost"
                    @click.stop="showNewPassword = !showNewPassword"
                  >
                    <UIcon :name="showNewPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'" />
                  </UButton>
                </template>
              </UInput>
            </UFormGroup>
          </UForm>

          <template #footer>
            <UButton type="submit" :loading="loading">
              Save {{ item.key === 'account' ? 'account' : 'password' }}
            </UButton>
          </template>
        </UCard>
      </template>
    </UTabs>
  </div>
</template>

<script setup lang="ts">
import { validateEmail, validatePassword } from '~/server/utils/validation'

const items = [
  {
    key: 'account',
    label: 'Account',
    description: "Make changes to your account here. Click save when you're done."
  },
  {
    key: 'password',
    label: 'Password',
    description: "Change your password here. Click save when you're done."
  }
]

const store = useStore()

const accountForm = reactive({ firstName: store.user?.firstName, lastName: store.user?.lastName })
const passwordForm = reactive({ currentPassword: '', newPassword: '' })

const validateAccount = (state: any): FormError[] => {
  const errors = []
  if (!state.firstName.trim()) errors.push({ path: 'firstName', message: 'Required' })
  if (!state.lastName.trim()) errors.push({ path: 'lastName', message: 'Required' })
  return errors
}

const validateNewPassword = (state: any): FormError[] => {
  const errors = []
  if (!state.currentPassword.trim()) errors.push({ path: 'currentPassword', message: 'Required' })
  else if (!validatePassword(state.currentPassword))
    errors.push({ path: 'currentPassword', message: 'Password must be at least 8 characters long' })
  if (!state.newPassword.trim()) errors.push({ path: 'newPassword', message: 'Required' })
  else if (!validatePassword(state.newPassword))
    errors.push({ path: 'newPassword', message: 'Password must be at least 8 characters long' })

  return errors
}

const loading = ref(false)

const showCurrentPassword = ref(false)
const showNewPassword = ref(false)

function onSubmit(key: string) {
  if (key === 'account') {
    return updateUser()
  }
  return updatePassword()
}

const updateUser = async () => {
  try {
    loading.value = true
    const data = await $fetch<FetchResponse<{ user: User }>>(`/api/users/me`, {
      method: 'PUT',
      body: {
        firstName: accountForm.firstName,
        lastName: accountForm.lastName
      }
    })

    store.setUser(data.user)
    successToast('Account updated successfully')
  } catch (error) {
    errorToast(error)
  } finally {
    loading.value = false
  }
}

const updatePassword = async () => {
  try {
    loading.value = true
    await $fetch(`/api/auth/me`, {
      method: 'PUT',
      body: {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      }
    })

    successToast('Password updated successfully')
  } catch (error) {
    errorToast(error)
  } finally {
    loading.value = false
  }
}
</script>
