export {}

declare global {
  type User = {
    id: string
    firstName: string
    lastName: string
    email: string
  }

  type Conversation = {
    id: string
    userId: string
    templateId: string
    chats: Chat[]
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

  type FetchResponse<T> = {
    statusCode: number
    message: string
  } & T

  type FetchResult<T> = FetchResponse<T> | FetchError
}
