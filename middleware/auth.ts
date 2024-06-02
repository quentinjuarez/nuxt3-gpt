export default defineNuxtRouteMiddleware((to, from) => {
  const store = useStore()

  if (!store.isAuthenticated) {
    errorToast({
      statusMessage: 'Unauthorized',
      data: {
        message: 'You need to login to access this page'
      }
    })

    const next = to.fullPath ? `?next=${to.fullPath}` : ''
    return navigateTo('/login' + next)
  }

  return
})
