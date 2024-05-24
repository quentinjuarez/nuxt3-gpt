import { defineStore } from 'pinia'

export const useStore = defineStore('store', {
  state: () => ({
    user: undefined as User | undefined,
    token: undefined as string | undefined
  }),
  getters: {
    isAuthenticated(state) {
      return !!state.user && !!state.token
    }
  },
  actions: {
    login(user: User, token: string) {
      this.user = user
      this.token = token
    },
    logout() {
      this.user = undefined
      this.token = undefined
    }
  },
  persist: true
})
