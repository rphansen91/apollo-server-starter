import { IAuthContext } from '../context'
import get from 'lodash/get'

export const userIdMiddleware = async (
  resolve: any,
  parent: any,
  args: any,
  context: IAuthContext,
  info: any
) => {
  const token = context.token
  if (!token) {
    return resolve(parent, args, context, info)
  }

  try {
    const uid =
      get(context, 'uid') || (await context.authStore.verifyIdToken(token))
    if (uid) {
      context.uid = uid
    }
  } catch (e) {
    return resolve(parent, args, context, info)
  }

  return resolve(parent, args, context, info)
}
