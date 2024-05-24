import type { H3Event, EventHandlerRequest } from 'h3'

const handleError = (event: H3Event<EventHandlerRequest>, statusCode: number, message: string) => {
  setResponseStatus(event, statusCode)
  return {
    statusCode,
    message
  }
}

export default handleError
