import User, { IUser } from '../../models/User'
import bcrypt from 'bcrypt'
import { validateEmail, validatePassword } from '../../utils/validation'
import { generateToken } from '../../utils/jwt'
import handleError from '../../utils/handleError'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { firstName, lastName, email, password } = body

  if (!firstName || !lastName || !email || !password) {
    return handleError(event, 400, 'All fields are required')
  }

  if (!validateEmail(email)) {
    return handleError(event, 400, 'Invalid email address')
  }

  if (!validatePassword(password)) {
    return handleError(event, 400, 'Password must be at least 8 characters long')
  }

  // Check if user already exists
  const existingUser: IUser | null = await User.findOne({ email })
  if (existingUser) {
    return handleError(event, 400, 'User already exists')
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

    const token = generateToken({ id: user._id, email: user.email })

    setCookie(event, '__token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    })

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
    return handleError(event, 500, 'Internal server error')
  }
})
