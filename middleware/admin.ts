export default defineNuxtRouteMiddleware((to, from) => {
  const store = useStore()

  if (!store.user?.isAdmin) {
    return navigateTo('/')
  }

  return
})
