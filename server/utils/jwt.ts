import jwt from 'jsonwebtoken'

export const generateToken = (payload: object): string => {
  const config = useRuntimeConfig()

  return jwt.sign(payload, config.jwtSecret, { expiresIn: '1y' })
}

export const verifyToken = (token: string): Auth => {
  const config = useRuntimeConfig()

  return jwt.verify(token, config.jwtSecret) as Auth
}
