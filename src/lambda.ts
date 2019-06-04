import XYOWeb3Gateway, { IGetContextCb } from './server'
import { ApolloServer } from 'apollo-server-lambda'
import lambda from 'aws-lambda'
import stopwatch from './utils/stopwatch'
import {
  createMongoStore,
  createFireStore,
  createAuthStore,
  initFirebaseApp,
} from './store'
import { getServerOptions, getSsmKeyNames } from './options'
import { getSecrets } from './store/ssm'
import { getHeader } from './utils/getHeader'
import { Account } from 'web3-eth-accounts'
import debug from 'debug'
import Web3 from 'web3'

const log = debug('manager')
const serverOptions = {
  cors: {
    origin: '*',
  },
}

const resolveServer = (async () => {
  log('Initializing')
  const options = getServerOptions()
  const { web3UriName, privateKeyName } = getSsmKeyNames()
  const initializeTimer = stopwatch()
  const serviceAccount = require(options.firebase.serviceAccountPath)
  const app = initFirebaseApp(options.firebase.databaseUrl, serviceAccount)
  const firestoreApp = app.firestore()
  const authStore = await createAuthStore(app.auth())
  const reinitializeMongoStore = createMongoStore(options.mongo.uri)
  const fireStore = await createFireStore(firestoreApp)
  const secrets = await getSecrets([web3UriName, privateKeyName])
  const web3Provider = await getWeb3Provider(secrets[web3UriName])
  const web3 = new Web3(web3Provider)
  const web3Account = await getWeb3Account(secrets[privateKeyName], web3)
  const getContext: IGetContextCb = async (event: any) => {
    const token = getHeader(event, 'X-Auth-Token')
    const mongoStore = await reinitializeMongoStore()
    const dataStore = { ...mongoStore, ...fireStore }
    return {
      dataStore,
      authStore,
      web3,
      web3Account,
      token,
      log,
    }
  }
  const server = new XYOWeb3Gateway(getContext, log)
  log('Initialized', initializeTimer())
  return server
})()

export const handler = (
  event: lambda.APIGatewayProxyEvent,
  context: lambda.Context,
  callback: lambda.APIGatewayProxyCallback
) => {
  context.callbackWaitsForEmptyEventLoop = false
  resolveServer
    .then(server => new ApolloServer(server.config))
    .then(server => server.createHandler(serverOptions))
    .then(handler => handler(event, context, callback))
    .catch((err: any) => {
      log(err.message)
      callback(err)
    })
}

async function getWeb3Account(
  privateKey: string | undefined,
  web3: Web3
): Promise<Account> {
  if (!privateKey) throw new Error('No private key path supplied')
  const account = web3.eth.accounts.privateKeyToAccount(privateKey)
  return (account as any) as Account
}

async function getWeb3Provider(uri: string | undefined) {
  if (!uri) throw new Error('No web3 provider endpoint')
  if (uri.indexOf('ws') === 0) return new Web3.providers.WebsocketProvider(uri)
  if (uri.indexOf('http') === 0) return new Web3.providers.HttpProvider(uri)
  throw new Error('Web 3 Provider not configured')
}
