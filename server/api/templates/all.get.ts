import Template, { ITemplate } from '../../models/Template'

export default defineEventHandler(async (event) => {
  try {
    if (!isAuth(event)) {
      return handleError(event, 401, 'Unauthorized')
    }

    const userIsAdmin = isAdmin(event)

    const { admin } = getQuery(event)

    if (admin && !userIsAdmin) {
      return handleError(event, 403, 'Forbidden')
    }

    const filter = admin === 'true' ? {} : { published: true }

    const result: ITemplate[] = await Template.find({ deletedAt: null, ...filter })

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
