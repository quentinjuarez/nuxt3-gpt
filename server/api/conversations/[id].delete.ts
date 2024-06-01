import { isValidObjectId } from 'mongoose'
import Conversation from '../../models/Conversation'

export default defineEventHandler(async (event) => {
  try {
    if (!isAuth(event)) {
      return handleError(event, 401, 'Unauthorized')
    }

    const { id } = getRouterParams(event)

    if (!isValidObjectId(id)) {
      return handleError(event, 400, 'Invalid conversation id')
    }

    const deletedAt = new Date().toISOString()

    const result = await Conversation.findOneAndUpdate(
      { _id: id, userId: event.context.auth.id },
      { deletedAt },
      { new: true }
    )

    if (!result) {
      return handleError(event, 404, 'Conversation not found')
    }

    return {
      statusCode: 200,
      message: 'Conversation deleted successfully'
    }
  } catch (error) {
    return handleError(event, 500, 'Internal server error')
  }
})
