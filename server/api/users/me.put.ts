import User, { IUser } from '../../models/User'
import sanitize from '../../utils/sanitize'

export default defineEventHandler(async (event) => {
  try {
    if (!isAuth(event)) {
      return handleError(event, 401, 'Unauthorized')
    }

    const { firstName, lastName } = await readBody(event)

    const sanitizedFirstName = sanitize(firstName.trim())
    const sanitizedLastName = sanitize(lastName.trim())

    const payload = {
      ...(sanitizedFirstName !== undefined ? { firstName: sanitizedFirstName } : {}),
      ...(sanitizedLastName !== undefined ? { sanitizedLastName: sanitizedLastName } : {})
    }

    const user: IUser | null = await User.findOneAndUpdate(
      { _id: event.context.auth.id },
      { $set: payload },
      { new: true }
    )

    if (!user) {
      return handleError(event, 404, 'User not found')
    }

    return {
      statusCode: 200,
      message: 'User updated successfully',
      user: userResolver(user)
    }
  } catch (error) {
    console.error(event.path, error)
    return handleError(event, 500, 'Internal server error')
  }
})
