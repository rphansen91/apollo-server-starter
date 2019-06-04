import { IMiddleware } from 'graphql-middleware'
import { GraphQLResolveInfo } from 'graphql'
import uniq from 'lodash/uniq'

export type IRule<TSource = any, TContext = any, TArgs = any> = (
  root: TSource,
  args: TArgs,
  ctx: TContext,
  info: GraphQLResolveInfo
) => Promise<Boolean>

export const ruleGenerator = (
  rule: IRule,
): IMiddleware => async (resolve, root, args, ctx, info) => {
  await rule(root, args, ctx, info)
  return resolve(root, args, ctx, info)
}

export const or = (rules: IRule[]) => ruleGenerator(async (root, args, ctx, info) => {
  const errors: string[] = []
  for (const rule of rules) {
    try {
      if (await rule(root, args, ctx, info)) return true
    } catch (e) {
      errors.push(e.message)
    }
  }
  throw new Error(uniq(errors).join(' | '))
})

export const and = (rules: IRule[]) => ruleGenerator(async (root, args, ctx, info) => {
  for (const rule of rules) {
    await rule(root, args, ctx, info)
  }
  return true
})
