export default defineNuxtRouteMiddleware((to, from) => {
  const store = useStore()

  if (!store.user?.isAdmin) {
    errorToast({
      statusMessage: 'Forbidden',
      data: {
        message: 'You are not authorized to access this page'
      }
    })
    return navigateTo('/')
  }

  return
})
