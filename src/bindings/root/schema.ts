import { gql } from 'apollo-server-express'

export const RootQuery = gql`
  query RootEmpty {
    empty
  }
`

export const RootMutation = gql`
  mutation RootMutation {
    empty
  }
`
