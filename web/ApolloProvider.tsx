import { ApolloClient, ApolloProvider as Provider, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: `http://localhost:3001/graphql`,
  cache: new InMemoryCache(),
});

export const ApolloProvider: React.FC = (props) => (
  <Provider client={client}>{props.children}</Provider>
);
