import Template from '~/server/models/Template'

export default defineEventHandler(async (event) => {
  try {
    if (!isAuth(event)) {
      return handleError(event, 401, 'Unauthorized')
    }

    if (!isAdmin(event)) {
      return handleError(event, 403, 'Forbidden')
    }

    const body = await readBody(event)

    if (!body.title) {
      return handleError(event, 400, 'Title is required')
    }

    const template = new Template({
      title: body.title,
      steps: [],
      draft: true
    })

    await template.save()

    setResponseStatus(event, 201)

    return {
      statusCode: 201,
      message: 'Template created successfully',
      template: templateResolver(template)
    }
  } catch (error) {
    return handleError(event, 500, 'Internal server error')
  }
})
