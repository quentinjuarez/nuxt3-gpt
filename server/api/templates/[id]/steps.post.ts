import Template, { ITemplate } from '~/server/models/Template'
import { Types } from 'mongoose'

export default defineEventHandler(async (event) => {
  try {
    if (!isAuth(event)) {
      return handleError(event, 401, 'Unauthorized')
    }

    if (!isAdmin(event)) {
      return handleError(event, 403, 'Forbidden')
    }

    const body = await readBody(event)

    if (!body.instruction || !body.prompt) {
      return handleError(event, 400, 'Instruction and prompt are required')
    }

    const { id } = getRouterParams(event)

    const newStepId = new Types.ObjectId()

    const template: ITemplate | null = await Template.findByIdAndUpdate(
      id,
      {
        $push: {
          steps: {
            _id: newStepId,
            instruction: body.instruction,
            prompt: body.prompt
          },
          stepIds: newStepId
        }
      },
      {
        new: true
      }
    )

    if (!template) {
      return handleError(event, 404, 'Template not found')
    }

    setResponseStatus(event, 201)

    return {
      statusCode: 201,
      message: 'Template created successfully',
      template: templateResolver(template)
    }
  } catch (error) {
    console.error(event.path, error)
    return handleError(event, 500, 'Internal server error')
  }
})
