import { ApolloClient, InMemoryCache, createHttpLink, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';

const httpLink = createHttpLink({
  uri: typeof window !== 'undefined' 
    ? window.location.origin + '/api/graphql'
    : 'http://localhost:3001/graphql',
});

const wsLink = typeof window !== 'undefined' ? new GraphQLWsLink(
  createClient({
    url: window.location.protocol === 'https:' 
      ? `wss://${window.location.host}/api/graphql`
      : `ws://${window.location.host}/api/graphql`,
  })
) : null;

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
    }
  };
});

const splitLink = typeof window !== 'undefined' && wsLink ? split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  authLink.concat(httpLink)
) : authLink.concat(httpLink);

export const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache({
    typePolicies: {
      Message: {
        fields: {
          createdAt: {
            merge: false,
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});
