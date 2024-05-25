export default defineNuxtRouteMiddleware(async (to, from) => {
  // refresh
  if (!from.name || from.name === 'login' || from.name === 'register') {
    const store = useStore()

    $fetch<FetchResult<{ conversations: Conversation[] }>>('/api/conversations/me').then((data) => {
      if ('conversations' in data) {
        store.setConversations(data.conversations)
      }
    })

    $fetch<FetchResult<{ templates: Template[] }>>('/api/templates/all').then((data) => {
      if ('templates' in data) {
        store.setTemplates(data.templates)
      }
    })

    return
  }

  return
})
