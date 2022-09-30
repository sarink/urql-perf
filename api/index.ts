import { ApolloServer, gql } from 'apollo-server';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { v4 } from 'uuid';

// NOTE: When making a change to the api, the server deos not automatically reload.
// You have to kill and restart the process manually
// If you update the schema, you should also run: `node fetch-schema.js` to rebuild the schema.json file for graphcache

const typeDefs = gql`
  type Query {
    getTodos: [Todo!]!
  }

  type Mutation {
    createTodo(name: String!, done: Boolean!): Todo!
    updateTodo(id: ID!, name: String, done: Boolean): Todo!
    removeTodo(id: ID!): ID!
  }

  type Todo {
    id: ID!
    name: String!
    done: Boolean!
  }
`;

type Todo = { id: string; name: string; done: boolean };
let todos: Todo[] = ['apples', 'bananas', 'oranges'].map((name, index) => ({
  id: `${index}`,
  name,
  done: Math.random() < 0.5,
}));

type CreateTodo = { name: string; done: boolean };
type UpdateTodo = { id: string; name?: string; done?: boolean };
type RemoveTodo = { id: string };

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
    removeTodo: (parent: any, input: RemoveTodo) => {
      todos = todos.filter((td) => td.id !== input.id);
      return input.id;
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
