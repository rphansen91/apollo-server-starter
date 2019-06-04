import get from 'lodash/get'
import { IPaginate, ISort } from '../store/mongo/crud'

export function withListQuery(
  data: any,
  defaultLimit = 100
): IPaginate & ISort {
  const page = get(data, 'pagination.page') || 1
  const perPage = get(data, 'pagination.perPage') || defaultLimit
  const field = get(data, 'sort.field') || '_id'
  const order = get(data, 'sort.order') === -1 ? -1 : 1
  return { page, perPage, field, order }
}
