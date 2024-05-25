export {}

declare global {
  type User = {
    id: string
    firstName: string
    lastName: string
    email: string
    isAdmin: boolean
  }

  type Conversation = {
    id: string
    userId: string
    templateId: string
    chats: Chat[]
  }

  type Chat = {
    id: string
    message: string
    senderId: string
    stepId: string
  }

  type TemplateStep = {
    id: string
    instruction: string
  }

  type Template = {
    id: string
    title: string
    steps: TemplateStep[]
    draft: boolean
  }

  type Auth = {
    id: string
    email: string
    isAdmin: boolean
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

  type FetchResult<T> = FetchResponse<T>
}
