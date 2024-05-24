import User, { IUser } from '../models/User'
import isAuth from '../utils/isAuth'

export default defineEventHandler(async (event) => {
  isAuth(event)

  const auth = event.context.auth as Auth

  const user: IUser | null = await User.findById(auth.id)

  return {
    statusCode: 200,
    user
  }
})
