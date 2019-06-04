import { IAuthContext } from '../context'
import { ruleGenerator, IRule } from '../../utils/permissions'

const isAuthenticated: IRule<any, IAuthContext> = async (r, a, c, i) => {
  if (!c.uid) throw new Error('Must be authenticated')
  return true
}

const requireAuth = ruleGenerator(isAuthenticated)

export const permissions = {
  Query: {},
  Mutation: {},
}
