import User, { IUser } from '../models/User'

export default defineEventHandler(async (event) => {
  try {
    if (!isAuth(event)) {
      return handleError(event, 401, 'Unauthorized')
    }

    const userIsAdmin = isAdmin(event)

    if (!userIsAdmin) {
      return handleError(event, 403, 'Forbidden')
    }

    const query = getQuery(event)

    const page = parseInt(query.page as string) || 1
    const limit = parseInt(query.limit as string) || 10

    const result: IUser[] = await User.find()
      .skip((page - 1) * limit)
      .limit(limit)

    const users = result.map(userResolver)

    const total = await User.countDocuments()

    return {
      statusCode: 200,
      message: 'Users fetched successfully',
      users: {
        items: users,
        page,
        pageCount: Math.ceil(total / limit),
        total
      }
    }
  } catch (error) {
    return handleError(event, 500, 'Internal server error')
  }
})
