import { defineStore } from 'pinia'

export const useStore = defineStore('store', {
  state: () => ({
    user: undefined as User | undefined
  }),
  getters: {
    isAuthenticated(state) {
      return !!state.user
    },
    initials(state) {
      if (!state.user) return 'N/A'

      return `${state.user.firstName[0]}${state.user.lastName[0]}`.toUpperCase()
    },
    username(state) {
      if (!state.user) return 'N/A'

      return `${state.user.firstName} ${state.user.lastName}`
    }
  },
  actions: {
    login(user: User) {
      this.user = user
    },
    logout() {
      this.user = undefined
    }
  },
  persist: true
})
