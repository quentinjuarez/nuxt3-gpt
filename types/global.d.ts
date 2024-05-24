export {}

declare global {
  type User = {
    id: string
    firstName: string
    lastName: string
    email: string
  }

  type Auth = {
    id: string
    email: string
  }

  type FetchError = {
    data: {
      statusCode: number
      message: string
    }
    statusMessage: string
  }
}
