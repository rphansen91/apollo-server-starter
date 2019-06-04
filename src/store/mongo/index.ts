import DataLoader, { BatchLoadFn } from 'dataloader'
import { MongoClient, Db } from 'mongodb'

const DB_NAME = ''

const useLoader = <K, V>(fn: BatchLoadFn<K, V>) => {
  const loader = new DataLoader<K, V>(fn)
  const load = (v: any) => loader.load(v)
  load.loadMany = (vs: any[]) => loader.loadMany(vs)
  return load
}

export const mongoLoaderFactory = (db: Db) => {
  return {}
}

export const mongoStoreFactory = (db: Db) => {
  return {}
}

export type IMongoStore = ReturnType<typeof mongoStoreFactory> &
  ReturnType<typeof mongoLoaderFactory>

export const createMongoStore = (
  uri?: string
): (() => Promise<IMongoStore>) => {
  if (!uri) throw new Error('Mongo uri not supplied')

  let store: ReturnType<typeof mongoStoreFactory>
  let client: MongoClient
  let database: Db

  return async () => {
    if (!client || !client.isConnected()) {
      client = await MongoClient.connect(uri)
      database = client.db(DB_NAME)
      store = mongoStoreFactory(database)
    }
    const loaders = mongoLoaderFactory(database)
    return { ...store, ...loaders }
  }
}
