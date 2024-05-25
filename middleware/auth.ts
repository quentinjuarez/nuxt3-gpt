export default defineNuxtRouteMiddleware((to, from) => {
  const store = useStore()

  if (!store.isAuthenticated) {
    const next = to.fullPath ? `?next=${to.fullPath}` : ''
    return navigateTo('/login' + next)
  }

  return
})
