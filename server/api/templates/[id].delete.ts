import { isValidObjectId } from 'mongoose'
import Template from '../../models/Template'

export default defineEventHandler(async (event) => {
  try {
    if (!isAuth(event)) {
      return handleError(event, 401, 'Unauthorized')
    }

    const { id } = getRouterParams(event)

    if (!isValidObjectId(id)) {
      return handleError(event, 400, 'Invalid template id')
    }

    if (!isAdmin(event)) {
      return handleError(event, 403, 'Forbidden')
    }

    const deletedAt = new Date().toISOString()

    const result = await Template.findOneAndUpdate({ _id: id }, { deletedAt }, { new: true })

    if (!result) {
      return handleError(event, 404, 'Template not found')
    }

    return {
      statusCode: 200,
      message: 'Template deleted successfully'
    }
  } catch (error) {
    return handleError(event, 500, 'Internal server error')
  }
})
