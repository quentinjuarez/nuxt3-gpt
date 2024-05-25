import Template, { ITemplate } from '~/server/models/Template'
import resolveIds from '~/server/utils/resolveIds'

export default defineEventHandler(async (event) => {
  const res = isAuth(event)

  if (!res) {
    return handleError(event, 401, 'Unauthorized')
  }

  const admin = isAdmin(event)

  if (!admin) {
    return handleError(event, 403, 'Forbidden')
  }

  const body = await readBody(event)

  if (!body.instruction) {
    return handleError(event, 400, 'Instruction is required')
  }

  const { id, stepId } = getRouterParams(event)

  try {
    const updatedAt = new Date()

    const template: ITemplate | null = await Template.findByIdAndUpdate(
      id,
      {
        $set: {
          'steps.$[step].instruction': body.instruction,
          'steps.$[step].updatedAt': updatedAt
        }
      },
      {
        new: true,
        arrayFilters: [{ 'step._id': stepId }]
      }
    )

    if (!template) {
      return handleError(event, 404, 'Template not found')
    }

    setResponseStatus(event, 201)

    return {
      statusCode: 201,
      message: 'Template updated successfully',
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
