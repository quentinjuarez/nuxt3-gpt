import User, { IUser } from '../../models/User'
import sanitize from '../../utils/sanitize'
import bcrypt from 'bcrypt'
import { validatePassword } from '../../utils/validation'

export default defineEventHandler(async (event) => {
  try {
    if (!isAuth(event)) {
      return handleError(event, 401, 'Unauthorized')
    }

    const { currentPassword, newPassword } = await readBody(event)

    const user: IUser | null = await User.findById(event.context.auth.id)

    if (!user) {
      return handleError(event, 404, 'User not found')
    }

    const validPassword = await bcrypt.compare(currentPassword, user.password)

    if (!validPassword) {
      return handleError(event, 401, 'Invalid password')
    }

    if (!validatePassword(newPassword)) {
      return handleError(event, 400, 'Password must be at least 8 characters long')
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    const updatedUser: IUser | null = await User.findOneAndUpdate(
      { _id: event.context.auth.id },
      {
        $set: {
          password: hashedPassword
        }
      },
      { new: true }
    )

    if (!updatedUser) {
      return handleError(event, 404, 'User update failed')
    }

    return {
      statusCode: 200,
      message: 'Password updated successfully',
      user: userResolver(updatedUser)
    }
  } catch (error) {
    console.error(event.path, error)
    return handleError(event, 500, 'Internal server error')
  }
})
