import type { H3Event, EventHandlerRequest } from 'h3'

const isAdmin = (event: H3Event<EventHandlerRequest>) => {
  const { isAdmin } = event.context.auth as Auth

  return isAdmin
}

export default isAdmin
