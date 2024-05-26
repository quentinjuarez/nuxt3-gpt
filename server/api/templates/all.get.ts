import Template, { ITemplate } from '../../models/Template'

export default defineEventHandler(async (event) => {
  try {
    if (!isAuth(event)) {
      return handleError(event, 401, 'Unauthorized')
    }

    const admin = isAdmin(event)

    const filter = admin ? {} : { draft: false }

    const result: ITemplate[] = await Template.find(filter)

    const templates = result.map(templateResolver)

    return {
      statusCode: 200,
      message: 'Templates fetched successfully',
      templates
    }
  } catch (error) {
    return handleError(event, 500, 'Internal server error')
  }
})
