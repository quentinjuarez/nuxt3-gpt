import handleError from './handleError'
import { verifyToken } from './jwt'
import type { H3Event, EventHandlerRequest } from 'h3'

const isAuth = (event: H3Event<EventHandlerRequest>) => {
  const token = getCookie(event, '__token')

  if (!token) {
    return handleError(event, 401, 'Unauthorized')
  }

  try {
    const auth = verifyToken(token)

    event.context.auth = auth
  } catch (error) {
    return handleError(event, 401, 'Unauthorized')
  }
}

export default isAuth
