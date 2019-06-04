export * from './firebase'
export * from './mongo'
import { IMongoStore } from './mongo'
import { IFireStore } from './firebase'
export type IDataStore = IMongoStore & IFireStore
