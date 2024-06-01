import { IConversation } from '../models/Conversation'
import { ITemplate } from '../models/Template'
import { IUser } from '../models/User'

export const resolveId = <T>(payload: T) => {
  // @ts-ignore
  const object = payload.toObject()
  // @ts-ignore
  object.id = object._id

  // @ts-ignore
  delete object._id

  return object
}

export const resolveIds = <T>(payloads: T[]) => {
  return payloads.map(resolveId)
}

export const conversationResolver = (conversation: IConversation) => {
  return {
    id: conversation._id,
    chats: resolveIds(conversation.chats),
    templateId: conversation.templateId,
    userId: conversation.userId,
    title: conversation.title
  }
}

export const templateResolver = (template: ITemplate) => {
  return {
    id: template._id,
    title: template.title,
    steps: resolveIds(
      template.stepIds.map((stepId) => {
        const step = template.steps.find((s) => String(s._id) === stepId)
        return step
      })
    ),
    published: template.published
  }
}

export const userResolver = (user: IUser) => {
  return {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    isAdmin: user.isAdmin
  }
}
