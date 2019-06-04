import Web3 from 'web3'
import { Debugger } from 'debug'
import { Account } from 'web3-eth-accounts'
import { IDataStore, IAuthStore } from '../store'

export interface IContext {
  web3: Web3
  token: string
  web3Account: Account
  dataStore: IDataStore
  authStore: IAuthStore
  log: Debugger
}

export type IAuthContext = IContext & {
  account: string
  uid: string
}
