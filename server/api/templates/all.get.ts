import resolveIds from '~/server/utils/resolveIds'
import Template, { ITemplate } from '../../models/Template'

export default defineEventHandler(async (event) => {
  const res = isAuth(event)

  if (!res) {
    return handleError(event, 401, 'Unauthorized')
  }

  const admin = isAdmin(event)

  const filter = admin ? {} : { draft: false }

  const result: ITemplate[] = await Template.find(filter)

  const templates = result.map((template) => ({
    id: template._id,
    title: template.title,
    steps: resolveIds(template.steps),
    draft: template.draft
  }))

  return {
    statusCode: 200,
    message: 'Templates fetched successfully',
    templates
  }
})
