import { isValidObjectId } from 'mongoose'
import Conversation, { IConversation } from '../../models/Conversation'

export default defineEventHandler(async (event) => {
  try {
    if (!isAuth(event)) {
      return handleError(event, 401, 'Unauthorized')
    }

    const { id } = getRouterParams(event)

    if (!isValidObjectId(id)) {
      return handleError(event, 400, 'Invalid conversation id')
    }

    const conversation: IConversation | null = await Conversation.findOne({
      _id: id,
      deletedAt: null
    })

    if (!conversation) {
      return handleError(event, 404, 'Conversation not found')
    }

    return {
      statusCode: 200,
      message: 'Conversation fetched successfully',
      conversation: conversationResolver(conversation)
    }
  } catch (error) {
    console.error(event.path, error)
    return handleError(event, 500, 'Internal server error')
  }
})
