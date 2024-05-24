export default defineEventHandler((event) => {
  deleteCookie(event, '__token')

  return {
    statusCode: 200,
    message: 'Logged out'
  }
})
