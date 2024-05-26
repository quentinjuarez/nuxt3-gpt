import Template, { ITemplate } from '~/server/models/Template'

export default defineEventHandler(async (event) => {
  if (!isAuth(event)) {
    return handleError(event, 401, 'Unauthorized')
  }

  if (!isAdmin(event)) {
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
      template: templateResolver(template)
    }
  } catch (error) {
    return handleError(event, 500, 'Internal server error')
  }
})
