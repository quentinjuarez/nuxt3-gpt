import { defineStore } from 'pinia'

export const useStore = defineStore('store', {
  state: () => ({
    user: undefined as User | undefined,
    conversations: [] as Conversation[],
    templates: [] as Template[],
    // states
    conversationsLoading: false,
    conversationsError: undefined as number | undefined,
    templatesLoading: false,
    templatesError: undefined as number | undefined
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
    },
    // data fetching
    async fetchConversations() {
      try {
        this.conversationsLoading = true
        const { conversations } =
          await $fetch<FetchResult<{ conversations: Conversation[] }>>('/api/conversations/me')

        this.conversations = conversations
      } catch (error) {
        const fetchError = error as FetchError
        this.conversations = []
        throw fetchError
      } finally {
        this.conversationsLoading = false
      }
    },
    async fetchTemplates(admin = false) {
      try {
        this.templatesLoading = true

        const params = admin ? { admin: 'true' } : {}

        const { templates } = await $fetch<FetchResult<{ templates: Template[] }>>(
          '/api/templates/all',
          { params }
        )

        this.templates = templates
      } catch (error) {
        const fetchError = error as FetchError
        this.templates = []
        throw fetchError
      } finally {
        this.templatesLoading = false
      }
    },
    // data updates
    updateTemplate(template: Template) {
      const index = this.templates.findIndex((template) => template.id === template.id)
      if (index === -1) return
      this.templates[index] = template
    },
    addTemplate(template: Template) {
      this.templates.push(template)
    },
    deleteTemplate(templateId: string) {
      const index = this.templates.findIndex((template) => templateId === template.id)
      if (index === -1) return
      this.templates.splice(index, 1)
    },
    addConversation(conversation: Conversation) {
      this.conversations.push(conversation)
    },
    deleteConversation(conversationId: string) {
      const index = this.conversations.findIndex(
        (conversation) => conversationId === conversation.id
      )
      if (index === -1) return
      this.conversations.splice(index, 1)
    }
  },
  persist: true
})
