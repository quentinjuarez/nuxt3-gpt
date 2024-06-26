import Template, { ITemplate } from '~/server/models/Template'
import Conversation, { IConversation } from '~/server/models/Conversation'
import { isValidObjectId } from 'mongoose'
import extractResponse from '~/server/utils/extractResponse'

export default defineEventHandler(async (event) => {
  try {
    if (!isAuth(event)) {
      return handleError(event, 401, 'Unauthorized')
    }

    const body = await readBody(event)

    if (!body.query || !isValidObjectId(body.id)) {
      return handleError(event, 400, 'Query or conversation id are missing')
    }

    const conversation: IConversation | null = await Conversation.findOne({
      _id: body.id,
      userId: event.context.auth.id,
      deletedAt: null
    })

    if (!conversation) {
      return handleError(event, 404, 'Conversation not found')
    }

    const template: ITemplate | null = await Template.findOne({
      _id: conversation.templateId,
      deletedAt: null
    })

    if (!template) {
      return handleError(event, 404, 'Template not found')
    }

    const firstStep = template.steps[0]

    const nextChat = {
      message: body.query,
      senderId: event.context.auth.id,
      stepId: firstStep._id
    }

    const client = openaiClient()

    const content = firstStep.prompt.replace('$input', body.query)

    const stream = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content }],
      stream: true
    })

    let botResponse = ''

    for await (const chunk of stream) {
      botResponse += chunk.choices[0]?.delta?.content || ''
    }

    const botChat = {
      message: extractResponse(botResponse),
      senderId: 'bot',
      stepId: firstStep._id
    }

    const updatedConversation: IConversation | null = await Conversation.findOneAndUpdate(
      { _id: body.id, userId: event.context.auth.id, deletedAt: null },
      { $push: { chats: [nextChat, botChat] } },
      { new: true }
    )

    if (!updatedConversation) {
      return handleError(event, 404, 'Conversation update failed')
    }

    setResponseStatus(event, 201)

    return {
      statusCode: 201,
      message: 'Template created successfully',
      conversation: conversationResolver(updatedConversation)
    }
  } catch (error) {
    console.error(event.path, error)
    return handleError(event, 500, 'Internal server error')
  }
})
