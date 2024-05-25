import jwt from 'jsonwebtoken'
import { IUser } from '../models/User'

export const generateToken = (user: IUser): string => {
  const config = useRuntimeConfig()

  const payload = { id: user._id, email: user.email, isAdmin: user.isAdmin }

  return jwt.sign(payload, config.jwtSecret, { expiresIn: '1y' })
}

export const verifyToken = (token: string): Auth => {
  const config = useRuntimeConfig()

  return jwt.verify(token, config.jwtSecret) as Auth
}
