import { ApolloServer, gql } from 'apollo-server';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { v4 } from 'uuid';

const typeDefs = gql`
  type Query {
    getTodos: [Todo!]!
  }

  type Mutation {
    createTodo(name: String!, done: Boolean!): Todo!
    updateTodo(id: ID!, name: String, done: Boolean): Todo!
  }

  type Todo {
    id: ID!
    name: String!
    done: Boolean!
  }
`;

type Todo = { id: string; name: string; done: boolean };
let todos: Todo[] = [];

type CreateTodo = { name: string; done: boolean };
type UpdateTodo = { id: string; name?: string; done?: boolean };

const resolvers = {
  Query: {
    getTodos: () => {
      return todos;
    },
  },
  Mutation: {
    createTodo: (parent: any, input: CreateTodo) => {
      const id = v4();
      const todo = { ...input, id };
      todos.push(todo);
      return todo;
    },
    updateTodo: (parent: any, input: UpdateTodo) => {
      const existing = todos.find((td) => td.id === input.id);
      if (!existing) throw new Error('No todo found');
      const updated = { ...existing, ...input };
      todos = todos.map((td) => (td.id === updated.id ? updated : td));
      return updated;
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
