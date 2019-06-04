import { ObjectID, ObjectId, Db, Cursor } from 'mongodb'
import get from 'lodash/get'

export type IPaginate = {
  perPage: number
  page: number
}
export type ISort = {
  field: string
  order: number
}
type IFilter = {
  filter?: any
}
type IPage<T> = {
  data: T[]
  total: number
  page: number
  last: boolean
}
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
type MaybeId = ObjectId | string | undefined | null
type MaybeWithId = { _id: MaybeId }
type WithStringId = { id: string }
type Map<T> = { [key: string]: T }
type ArrayMap<T> = Map<T[]>

const toStringId = (id: MaybeId) => {
  if (!id) return ''
  if (!id.toString) return ''
  return id.toString()
}

const withStringId = <T>(doc: T & MaybeWithId): T & WithStringId => {
  const id = toStringId(doc._id)
  return Object.assign({}, doc, { id })
}

export const findById = <T>(mongo: Db, colName: string) => async (
  id: string
): Promise<T | null> => {
  const _id = new ObjectID(id)
  const doc = await mongo.collection(colName).findOne<T & MaybeWithId>({ _id })
  return doc ? withStringId(doc) : null
}

export const findManyBy = <T>(
  mongo: Db,
  colName: string,
  key: string
) => async ($in: (string | number)[]): Promise<T[][]> => {
  const results: T[][] = []
  const resultIndex = $in.reduce(
    (acc: Map<number>, c, i) => {
      results[i] = []
      acc[c] = i
      return acc
    },
    {} as Map<number>
  )
  const docs = await find<T & MaybeWithId>(mongo, colName)({ [key]: { $in } })
  docs.forEach((doc: T & MaybeWithId) => {
    const value = get(doc, key)
    if (results[resultIndex[value]]) results[resultIndex[value]].push(doc)
  })
  return results
}

export const findByIds = <T>(mongo: Db, colName: string) => async (
  ids: string[]
): Promise<T[]> => {
  const $in = ids.map(id => new ObjectID(id))
  const data = await mongo
    .collection(colName)
    .find<T & MaybeWithId>({ _id: { $in } })
    .toArray()
  return data.map(withStringId)
}

export const findOne = <T>(mongo: Db, colName: string) => async (
  filter: any
): Promise<(T & WithStringId) | null> => {
  const doc = await mongo.collection(colName).findOne<T & MaybeWithId>(filter)
  return doc ? withStringId(doc) : null
}

export const find = <T>(mongo: Db, colName: string) => async (
  filter: any
): Promise<(T & WithStringId)[]> => {
  const data = await mongo
    .collection(colName)
    .find<T & MaybeWithId>(filter)
    .toArray()
  return data.map(withStringId)
}

export const count = (mongo: Db, colName: string) => async (
  filter: any
): Promise<number> => {
  const total = mongo.collection(colName).countDocuments(filter)
  return (total as any) as number
}

export const list = <T>(mongo: Db, colName: string) => async ({
  perPage,
  page,
  field,
  order,
  filter,
}: IPaginate & ISort & IFilter): Promise<IPage<T>> => {
  const col = mongo.collection(colName)
  const query = filter || {}
  const pageRef = paginateQuery(
    col.find<T & MaybeWithId>(query).sort({ [field]: order }),
    {
      perPage,
      page,
    }
  )
  const [count, results] = await Promise.all([
    col.countDocuments(query),
    pageRef.toArray(),
  ])
  const total = (count as any) as number
  const data = results.map(withStringId)
  const last = page * perPage >= total ? true : false
  return { total, data, page, last }
}

const paginateQuery = <T>(ref: Cursor<T>, { perPage, page }: IPaginate) => {
  const start = (page - 1) * perPage
  return ref.skip(start).limit(perPage)
}

export const create = <T extends WithStringId>(
  mongo: Db,
  colName: string
) => async (input: Omit<T, 'id'>) => {
  const col = mongo.collection(colName)
  const { insertedId } = await col.insertOne(input)
  return findOne<T>(mongo, colName)({ _id: insertedId })
}

export const update = <T>(mongo: Db, colName: string) => async (
  id: string,
  input: any
) => {
  const col = mongo.collection(colName)
  const _id = new ObjectID(id)
  await col.updateOne({ _id }, { $set: input })
  return findOne<T>(mongo, colName)({ _id })
}

export const updateMany = (mongo: Db, colName: string) => async (
  query: any,
  input: any
) => {
  const col = mongo.collection(colName)
  return col.updateMany(query, { $set: input })
}

export const remove = <T>(mongo: Db, colName: string) => async (id: string) => {
  const col = mongo.collection(colName)
  const _id = new ObjectID(id)
  const doc = await findOne<T>(mongo, colName)({ _id })
  await col.deleteOne({ _id })
  return doc
}

export const removeMany = <T>(mongo: Db, colName: string) => async (
  ids: string[]
) => {
  const col = mongo.collection(colName)
  const $in = ids.map(id => new ObjectID(id))
  const res = await col.deleteMany({ _id: { $in } })
  return res.deletedCount
}
