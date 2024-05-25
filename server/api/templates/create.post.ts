import Template, { ITemplate } from '~/server/models/Template'

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

  if (!body.title) {
    return handleError(event, 400, 'Title is required')
  }

  try {
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
      template: {
        id: template._id,
        title: template.title,
        steps: template.steps,
        draft: template.draft
      }
    }
  } catch (error) {
    return handleError(event, 500, 'Internal server error')
  }
})
