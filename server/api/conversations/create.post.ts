import Template, { ITemplate } from '~/server/models/Template'
import Conversation from '~/server/models/Conversation'

export default defineEventHandler(async (event) => {
  try {
    if (!isAuth(event)) {
      return handleError(event, 401, 'Unauthorized')
    }

    const body = await readBody(event)

    if (!body.templateId || !body.query) {
      return handleError(event, 400, 'Template ID and query are required')
    }

    const template: ITemplate | null = await Template.findOne({
      _id: body.templateId,
      deletedAt: null
    })

    if (!template) {
      return handleError(event, 404, 'Template not found')
    }

    const firstStep = template.steps[0]

    const firstChat = {
      message: firstStep.instruction,
      senderId: 'bot',
      stepId: template.steps[0]._id
    }

    const newChat = {
      message: body.query,
      senderId: event.context.auth.id,
      stepId: template.steps[0]._id
    }

    const conversation = new Conversation({
      title: template.title,
      userId: event.context.auth.id,
      templateId: body.templateId,
      chats: [firstChat, newChat]
    })

    await conversation.save()

    setResponseStatus(event, 201)

    return {
      statusCode: 201,
      message: 'Template created successfully',
      conversation: conversationResolver(conversation)
    }
  } catch (error) {
    return handleError(event, 500, 'Internal server error')
  }
})
