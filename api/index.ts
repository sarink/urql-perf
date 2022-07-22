import { ApolloServer, gql } from 'apollo-server';
import data from './data.json';
import {
  ApolloServerPluginLandingPageDisabled,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from 'apollo-server-core';

const typeDefs = gql`
  type Query {
    getTransactions: [Transaction!]!
    getBits: [Bit!]!
  }

  enum BitFrequency {
    Monthly
  }

  type Bit {
    id: ID!
    name: String!
    frequency: BitFrequency!
    amount: Int!
    index: String!
    transactions: [Transaction!]
  }

  type Account {
    id: ID!
    name: String!
    plaidItem: PlaidItem
  }

  type PlaidItem {
    id: ID!
    name: String!
    institution: Institution
  }

  type Institution {
    id: ID!
    name: String!
  }

  type Transaction {
    id: ID!
    account: Account
    amount: Float!
    category: [String!]!
    date: String!
    location: TransactionLocation
    name: String!
    merchantName: String
    paymentChannel: String!
    paymentMeta: TransactionPaymentMeta
    pending: Boolean!
    bit: Bit
  }

  type TransactionPaymentMeta {
    paymentProcessor: String
  }

  type TransactionLocation {
    city: String
    region: String
  }
`;

const resolvers = {
  Query: {
    getTransactions: () => {
      return data.getTransactions;
    },
    getBits: () => {
      return data.getBits;
    },
  },
};

const PORT = 3001;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [
    ApolloServerPluginLandingPageGraphQLPlayground({
      settings: {
        'schema.polling.enable': false,
      },
    }),
  ],
});

server.listen(PORT).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
