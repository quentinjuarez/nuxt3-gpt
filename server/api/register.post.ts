import User, { IUser } from '../models/User'
import bcrypt from 'bcrypt'
import { validateEmail, validatePassword } from '../utils/validation'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { firstName, lastName, email, password } = body

  if (!firstName || !lastName || !email || !password) {
    return {
      status: 400,
      message: 'All fields are required'
    }
  }

  if (!validateEmail(email)) {
    return {
      status: 400,
      message: 'Invalid email'
    }
  }

  if (!validatePassword(password)) {
    return {
      status: 400,
      message: 'Password must be at least 6 characters long'
    }
  }

  // Check if user already exists
  const existingUser: IUser | null = await User.findOne({ email })
  if (existingUser) {
    return {
      status: 400,
      message: 'User already exists'
    }
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
    return {
      status: 201,
      message: 'User registered successfully',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    }
  } catch (error) {
    return {
      status: 500,
      message: 'Internal server error'
    }
  }
})
