import { GraphQLSchema } from 'graphql'
import { ApolloServer, Config } from 'apollo-server'
import { applyMiddleware } from 'graphql-middleware'
import { makeExecutableSchema } from 'graphql-tools'
import { xyoResolvers, xyoTypeDefs, IContext } from './gql'
import { logMiddleware } from './gql/middlewares/logResolvers'
import { permissions } from './gql/middlewares/permissions'
import { userIdMiddleware } from './gql/middlewares/userId'
import debug, { Debugger } from 'debug'

export type IGetContextCb = (event: any) => Promise<IContext>

export default class XYOWeb3Gateway {
  public config: Config
  public schema: GraphQLSchema

  constructor(
    public getContext: IGetContextCb,
    public log: Debugger = debug('graphql')
  ) {
    this.schema = makeExecutableSchema({
      typeDefs: xyoTypeDefs,
      resolvers: xyoResolvers,
    })

    this.schema = applyMiddleware(
      this.schema,
      logMiddleware(this.log),
      userIdMiddleware,
      permissions
    )

    this.config = {
      schema: this.schema,
      context: this.context,
    }
  }

  start = async (port: number) => {
    const server = new ApolloServer(this.config)
    const { url } = await server.listen({ port })
    return url
  }

  context = (event: any): Promise<IContext> => {
    return this.getContext(event)
  }
}
