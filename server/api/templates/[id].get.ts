import { isValidObjectId } from 'mongoose'
import Template, { ITemplate } from '../../models/Template'
import resolveIds from '~/server/utils/resolveIds'

export default defineEventHandler(async (event) => {
  try {
    const res = isAuth(event)

    if (!res) {
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
      template: {
        id: template._id,
        title: template.title,
        steps: resolveIds(template.steps),
        draft: template.draft
      }
    }
  } catch (error) {
    return handleError(event, 500, 'Internal server error')
  }
})
