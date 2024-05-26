import Template, { ITemplate } from '~/server/models/Template'

export default defineEventHandler(async (event) => {
  try {
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

    const { id } = getRouterParams(event)

    const template: ITemplate | null = await Template.findByIdAndUpdate(
      id,
      {
        $push: {
          steps: {
            instruction: body.instruction
          }
        }
      },
      {
        new: true
      }
    )

    if (!template) {
      return handleError(event, 404, 'Template not found')
    }

    const newStep = template.steps[template.steps.length - 1]

    const updatedTemplate: ITemplate | null = await Template.findByIdAndUpdate(
      id,
      {
        $push: {
          stepIds: newStep._id
        }
      },
      {
        new: true
      }
    )

    if (!updatedTemplate) {
      return handleError(event, 404, 'Template not found')
    }

    setResponseStatus(event, 201)

    return {
      statusCode: 201,
      message: 'Template created successfully',
      template: templateResolver(updatedTemplate)
    }
  } catch (error) {
    return handleError(event, 500, 'Internal server error')
  }
})
