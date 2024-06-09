import Conversation, { IConversation } from '../models/Conversation'

export default defineEventHandler(async (event) => {
  try {
    if (!isAuth(event)) {
      return handleError(event, 401, 'Unauthorized')
    }

    const auth = event.context.auth as Auth

    const conversations: IConversation[] = await Conversation.find({
      deletedAt: null,
      userId: auth.id
    })

    return {
      statusCode: 200,
      message: 'Conversations fetched successfully',
      conversations: conversations.map(conversationResolver)
    }
  } catch (error) {
    console.error(event.path, error)
    return handleError(event, 500, 'Internal server error')
  }
})
