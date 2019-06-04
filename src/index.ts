require('dotenv').config()

import XYOWeb3Gateway, { IGetContextCb } from './server'
import {
  createMongoStore,
  createFireStore,
  createAuthStore,
  initFirebaseApp,
} from './store'
import { getServerOptions, getWeb3ProviderOptions } from './options'
import { readFileSync, writeFileSync } from 'fs'
import { getHeader } from './utils/getHeader'
import { Account } from 'web3-eth-accounts'
import debug from 'debug'
import Web3 from 'web3'

main()

async function main() {
  const log = debug('manager')
  try {
    const options = getServerOptions()
    const serviceAccount = require(options.firebase.serviceAccountPath)
    const app = initFirebaseApp(options.firebase.databaseUrl, serviceAccount)
    const authStore = await createAuthStore(app.auth())
    const firestoreApp = app.firestore()
    const web3Provider = await getWeb3Provider()
    const web3 = new Web3(web3Provider)
    const reinitializeMongoStore = createMongoStore(options.mongo.uri)
    const fireStore = await createFireStore(firestoreApp)
    const web3Account = await getOrCreateWeb3Account(
      options.privateKeyPath,
      web3
    )
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
    const url = await server.start(options.port)
    log(`🚀 Listening at ${url}`)
  } catch (e) {
    log.enabled = true
    log('❌ Boot error', e.message)
    log(e.stack)
  }
}

async function getOrCreateWeb3Account(
  privateKeyPath: string | undefined,
  web3: Web3
): Promise<Account> {
  let privateKey = ''
  if (!privateKeyPath) throw new Error('No private key path supplied')
  try {
    privateKey = readFileSync(privateKeyPath, 'utf8')
  } catch (e) {
    const account = web3.eth.accounts.create()
    writeFileSync(privateKeyPath, account.privateKey, 'utf8')
    return (account as any) as Account
  }
  if (!privateKey) {
    throw new Error(`No public key found in path: "${privateKeyPath}"`)
  }
  const account = web3.eth.accounts.privateKeyToAccount(privateKey)
  return (account as any) as Account
}

async function getWeb3Provider() {
  const { ipc, http, socket } = getWeb3ProviderOptions()
  if (ipc) return new Web3.providers.IpcProvider(ipc, require('net'))
  if (socket) return new Web3.providers.WebsocketProvider(socket)
  if (http) return new Web3.providers.HttpProvider(http)
  throw new Error('Web 3 Provider not configured')
}
