import { verifyToken } from './jwt'
import type { H3Event, EventHandlerRequest } from 'h3'

const isAuth = (event: H3Event<EventHandlerRequest>) => {
  try {
    const token = getCookie(event, '__token')

    if (!token) {
      return false
    }

    const auth = verifyToken(token)

    event.context.auth = auth

    return true
  } catch (error) {
    return false
  }
}

export default isAuth
