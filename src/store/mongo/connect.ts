import { MongoClient } from 'mongodb'

let mongo: MongoClient
let promise: Promise<MongoClient>

export default async (uri: string) => {
  if (mongo && mongo.isConnected()) return mongo
  promise = MongoClient.connect(uri)
  mongo = await promise
  return mongo
}
