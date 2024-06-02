import User, { IUser } from '../../models/User'
import bcrypt from 'bcrypt'
import { validateEmail, validatePassword } from '../../utils/validation'
import { generateToken } from '../../utils/jwt'
import handleError from '../../utils/handleError'

export default defineEventHandler(async (event) => {
  try {
    if (!isAuth(event)) {
      return handleError(event, 401, 'Unauthorized')
    }

    const user: IUser | null = await User.findOne({ _id: event.context.auth.id })

    if (!user) {
      return handleError(event, 404, 'User not found')
    }

    setResponseStatus(event, 200)

    return {
      statusCode: 200,
      message: 'User registered successfully',
      user: userResolver(user)
    }
  } catch (error) {
    return handleError(event, 500, 'Internal server error')
  }
})
