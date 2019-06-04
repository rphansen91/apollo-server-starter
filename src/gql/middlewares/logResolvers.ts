import { ResponsePath, GraphQLResolveInfo } from 'graphql'
import debug, { Debugger } from 'debug'
import stopwatch from '../../utils/stopwatch'
import identity from 'lodash/identity'
import { IAuthContext } from '../context'

const fullInfoPathName = (
  { prev, key }: ResponsePath,
  name: string = ''
): string => {
  const newName = [key, name].filter(identity).join('.')
  if (!prev) return newName
  return fullInfoPathName(prev, newName)
}

const pathDepth = ({ prev }: ResponsePath, count = 0): number => {
  if (!prev) return count
  return pathDepth(prev, count + 1)
}

export const logMiddleware = (log: Debugger = debug('graphql'), depth = 1) => {
  return async (
    resolve: any,
    parent: any,
    args: any,
    context: IAuthContext,
    info: GraphQLResolveInfo
  ) => {
    if (pathDepth(info.path) > depth) {
      return resolve(parent, args, context, info)
    }
    const name = fullInfoPathName(info.path)
    const argsStr = JSON.stringify(args)
    const timer = stopwatch()
    try {
      if (context) context.log = log
      const result = await resolve(parent, args, context, info)
      if (!info.path.prev) {
        log('\n\n\n')
        log('==== XYO Request ====')
        log(`uid: ${context.uid}`)
        log(`account: ${context.account}`)
      }
      context.log(`${name}(${argsStr})`, `Timer ${timer()}ms`)
      return result
    } catch (e) {
      context.log(`${name}(${argsStr})`, 'error', e.message, e.stack)
      context.log(`${name}(${argsStr})`, `Timer ${timer()}ms`)
      throw e
    }
  }
}
