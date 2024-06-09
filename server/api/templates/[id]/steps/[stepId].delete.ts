import Template, { ITemplate } from '~/server/models/Template'

export default defineEventHandler(async (event) => {
  if (!isAuth(event)) {
    return handleError(event, 401, 'Unauthorized')
  }

  if (!isAdmin(event)) {
    return handleError(event, 403, 'Forbidden')
  }

  const { id, stepId } = getRouterParams(event)

  try {
    // pull step id
    const template: ITemplate | null = await Template.findByIdAndUpdate(
      id,
      {
        $pull: {
          steps: {
            _id: stepId
          },
          stepIds: stepId
        }
      },
      {
        new: true
      }
    )

    if (!template) {
      return handleError(event, 404, 'Template not found')
    }

    setResponseStatus(event, 200)

    return {
      statusCode: 200,
      message: 'Template deleted successfully',
      template: templateResolver(template)
    }
  } catch (error) {
    console.error(event.path, error)
    return handleError(event, 500, 'Internal server error')
  }
})
