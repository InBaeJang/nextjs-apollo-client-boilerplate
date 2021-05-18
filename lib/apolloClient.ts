import { useMemo } from 'react'
import { ApolloClient, InMemoryCache, NormalizedCacheObject, HttpLink } from '@apollo/client'

let apolloClient: ApolloClient<NormalizedCacheObject>

function createIsomorphLink() {
  return new HttpLink({
    uri: 'https://api.graphqlplaceholder.com/',
    credentials: 'same-origin',
  })
}

function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: createIsomorphLink(),
    cache: new InMemoryCache(),
  })
}

export function initializeApollo(initialState = null) {
  const _apolloClient = apolloClient ?? createApolloClient()

  if (initialState) {
    _apolloClient.cache.restore(initialState!)
  }

  if (typeof window === 'undefined') return _apolloClient

  if (!apolloClient) apolloClient = _apolloClient

  return _apolloClient
}

export function useApollo(initialState: any) {
  const store = useMemo(() => initializeApollo(initialState), [initialState])
  return store
}
