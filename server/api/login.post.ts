import User, { IUser } from '../models/User'
import bcrypt from 'bcrypt'
import { validateEmail, validatePassword } from '../utils/validation'
import { generateToken } from '../utils/jwt'

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
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid email address',
      stack: undefined
    })
  }

  if (!validatePassword(password)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Password must be at least 8 characters long',
      stack: undefined
    })
  }

  try {
    const user: IUser | null = await User.findOne({ email })

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid email or password',
        stack: undefined
      })
    }

    const validPassword = await bcrypt.compare(password, user.password)

    if (!validPassword) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid email or password',
        stack: undefined
      })
    }

    setResponseStatus(event, 200)

    const token = generateToken({ id: user._id, email: user.email })

    return {
      statusCode: 200,
      message: 'User logged in successfully',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
      stack: undefined
    })
  }
})
