import User, { IUser } from '../../models/User'
import bcrypt from 'bcrypt'
import { validateEmail, validatePassword } from '../../utils/validation'
import { generateToken } from '../../utils/jwt'
import handleError from '../../utils/handleError'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { email, password } = body

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'All fields are required',
      stack: undefined
    })
  }

  if (!validateEmail(email)) {
    return handleError(event, 400, 'Invalid email address')
  }

  if (!validatePassword(password)) {
    return handleError(event, 400, 'Password must be at least 8 characters long')
  }

  const user: IUser | null = await User.findOne({ email })

  if (!user) {
    return handleError(event, 401, 'Invalid email or password')
  }

  const validPassword = await bcrypt.compare(password, user.password)

  if (!validPassword) {
    return handleError(event, 401, 'Invalid email or password')
  }

  try {
    setResponseStatus(event, 200)

    const token = generateToken(user)

    setCookie(event, '__token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    })

    return {
      statusCode: 200,
      message: 'User logged in successfully',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isAdmin: user.isAdmin
      }
    }
  } catch (error) {
    return handleError(event, 500, 'Internal server error')
  }
})
