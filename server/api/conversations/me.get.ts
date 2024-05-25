import Conversation, { IConversation } from '../../models/Conversation'

export default defineEventHandler(async (event) => {
  const res = isAuth(event)

  if (!res) {
    return handleError(event, 401, 'Unauthorized')
  }

  const auth = event.context.auth as Auth

  const conversations: IConversation[] = await Conversation.find({ userId: auth.id })

  return {
    statusCode: 200,
    message: 'Conversations fetched successfully',
    conversations
  }
})
