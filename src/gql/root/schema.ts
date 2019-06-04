import gql from 'graphql-tag'

export default gql`
  input Pagination {
    perPage: Int
    page: Int
  }

  input Sort {
    field: String
    order: Int
  }

  type Query {
    empty: String
  }

  type Mutation {
    empty: String
  }
`
