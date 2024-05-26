import { isValidObjectId } from 'mongoose'
import Template, { ITemplate } from '../../models/Template'

export default defineEventHandler(async (event) => {
  try {
    if (!isAuth(event)) {
      return handleError(event, 401, 'Unauthorized')
    }

    const { id } = getRouterParams(event)

    if (!isValidObjectId(id)) {
      return handleError(event, 400, 'Invalid template id')
    }

    const admin = isAdmin(event)

    const filter = admin ? {} : { draft: false }

    const template: ITemplate | null = await Template.findOne({ _id: id, ...filter })

    if (!template) {
      return handleError(event, 404, 'Template not found')
    }

    return {
      statusCode: 200,
      message: 'Template fetched successfully',
      template: templateResolver(template)
    }
  } catch (error) {
    return handleError(event, 500, 'Internal server error')
  }
})
