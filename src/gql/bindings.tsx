export type Maybe<T> = T | null
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
}

export type Mutation = {
  empty?: Maybe<Scalars['String']>
}

export type Pagination = {
  perPage?: Maybe<Scalars['Int']>
  page?: Maybe<Scalars['Int']>
}

export type Query = {
  empty?: Maybe<Scalars['String']>
}

export type Sort = {
  field?: Maybe<Scalars['String']>
  order?: Maybe<Scalars['Int']>
}
export type RootEmptyQueryVariables = {}

export type RootEmptyQuery = { __typename?: 'Query' } & Pick<Query, 'empty'>

export type RootMutationMutationVariables = {}

export type RootMutationMutation = { __typename?: 'Mutation' } & Pick<
  Mutation,
  'empty'
>

import gql from 'graphql-tag'
import * as React from 'react'
import * as ReactApollo from 'react-apollo'
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export const RootEmptyDocument = gql`
  query RootEmpty {
    empty
  }
`

export const RootEmptyComponent = (
  props: Omit<
    Omit<
      ReactApollo.QueryProps<RootEmptyQuery, RootEmptyQueryVariables>,
      'query'
    >,
    'variables'
  > & { variables?: RootEmptyQueryVariables }
) => (
  <ReactApollo.Query<RootEmptyQuery, RootEmptyQueryVariables>
    query={RootEmptyDocument}
    {...props}
  />
)

export type RootEmptyProps<TChildProps = {}> = Partial<
  ReactApollo.DataProps<RootEmptyQuery, RootEmptyQueryVariables>
> &
  TChildProps
export function withRootEmpty<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    RootEmptyQuery,
    RootEmptyQueryVariables,
    RootEmptyProps<TChildProps>
  >
) {
  return ReactApollo.withQuery<
    TProps,
    RootEmptyQuery,
    RootEmptyQueryVariables,
    RootEmptyProps<TChildProps>
  >(RootEmptyDocument, {
    alias: 'withRootEmpty',
    ...operationOptions,
  })
}
export const RootMutationDocument = gql`
  mutation RootMutation {
    empty
  }
`
export type RootMutationMutationFn = ReactApollo.MutationFn<
  RootMutationMutation,
  RootMutationMutationVariables
>

export const RootMutationComponent = (
  props: Omit<
    Omit<
      ReactApollo.MutationProps<
        RootMutationMutation,
        RootMutationMutationVariables
      >,
      'mutation'
    >,
    'variables'
  > & { variables?: RootMutationMutationVariables }
) => (
  <ReactApollo.Mutation<RootMutationMutation, RootMutationMutationVariables>
    mutation={RootMutationDocument}
    {...props}
  />
)

export type RootMutationProps<TChildProps = {}> = Partial<
  ReactApollo.MutateProps<RootMutationMutation, RootMutationMutationVariables>
> &
  TChildProps
export function withRootMutation<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    RootMutationMutation,
    RootMutationMutationVariables,
    RootMutationProps<TChildProps>
  >
) {
  return ReactApollo.withMutation<
    TProps,
    RootMutationMutation,
    RootMutationMutationVariables,
    RootMutationProps<TChildProps>
  >(RootMutationDocument, {
    alias: 'withRootMutation',
    ...operationOptions,
  })
}
