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

    if (!admin) {
      return handleError(event, 403, 'Forbidden')
    }

    const { title, draft } = await readBody(event)

    const payload = {
      ...(title !== undefined ? { title } : {}),
      ...(draft !== undefined ? { draft } : {})
    }

    const template: ITemplate | null = await Template.findOneAndUpdate(
      { _id: id },
      { $set: payload },
      { new: true }
    )

    if (!template) {
      return handleError(event, 404, 'Template not found')
    }

    return {
      statusCode: 200,
      message: 'Template updated successfully',
      template: templateResolver(template)
    }
  } catch (error) {
    return handleError(event, 500, 'Internal server error')
  }
})
