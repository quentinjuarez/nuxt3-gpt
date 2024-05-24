import Conversation, { IConversation } from '../../models/Conversation'
import isAuth from '../../utils/isAuth'

export default defineEventHandler(async (event) => {
  isAuth(event)

  const auth = event.context.auth as Auth

  const conversations: IConversation[] = await Conversation.find({ userId: auth.id })

  return {
    statusCode: 200,
    message: 'Conversations fetched successfully',
    conversations
  }
})
