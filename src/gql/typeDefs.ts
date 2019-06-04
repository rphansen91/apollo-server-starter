import { mergeTypes } from 'merge-graphql-schemas'
import root from './root/schema'

export default mergeTypes([
  root,
])
