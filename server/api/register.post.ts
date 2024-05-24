import User, { IUser } from '../models/User'
import bcrypt from 'bcrypt'
import { validateEmail, validatePassword } from '../utils/validation'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { firstName, lastName, email, password } = body

  if (!firstName || !lastName || !email || !password) {
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

  // Check if user already exists
  const existingUser: IUser | null = await User.findOne({ email })
  if (existingUser) {
    throw createError({
      statusCode: 400,
      statusMessage: 'User already exists',
      stack: undefined
    })
  }

  // Hash the password
  const hashedPassword: string = await bcrypt.hash(password, 10)

  // Create a new user
  const user: IUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword
  })

  try {
    await user.save()
    setResponseStatus(event, 201)
    return {
      statusCode: 201,
      message: 'User registered successfully',
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
