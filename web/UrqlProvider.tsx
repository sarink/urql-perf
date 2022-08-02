import { devtoolsExchange } from '@urql/devtools';
import { offlineExchange } from '@urql/exchange-graphcache';
import { makeDefaultStorage } from '@urql/exchange-graphcache/default-storage';
import { IntrospectionData } from '@urql/exchange-graphcache/dist/types/ast';
import { requestPolicyExchange } from '@urql/exchange-request-policy';
import { uniqueId } from 'lodash';
import React, { useMemo } from 'react';
import { GET_TODOS } from 'Todos';
import { createClient, dedupExchange, Exchange, fetchExchange, Operation, Provider } from 'urql';
import { fromPromise, map, mergeMap, pipe } from 'wonka';
import schema from './schema.json';

const setContextExchange =
  (contextSetter: (operation: Operation) => Promise<Operation['context']>): Exchange =>
  ({ forward }) =>
  (ops$) =>
    pipe(
      ops$,
      mergeMap((operation) =>
        pipe(
          fromPromise(Promise.resolve(contextSetter(operation))),
          map((newContext) => ({ ...operation, context: newContext }))
        )
      ),
      forward
    );

export const UrqlProvider: React.FC = (props) => {
  const client = useMemo(
    () =>
      createClient({
        url: `http://localhost:3001/graphql`,
        exchanges: [
          devtoolsExchange,
          dedupExchange,
          requestPolicyExchange({}),
          offlineExchange({
            schema: schema as any as IntrospectionData,
            storage: makeDefaultStorage({ idbName: `urql-todos` }),

            optimistic: {
              createTodo: (todo) => {
                const result = {
                  ...todo,
                  id: uniqueId('todo-'),
                  __typename: 'Todo',
                };
                console.log('optimistic.createTodo', result);
                return result;
              },
              updateTodo: (todo) => {
                const result = {
                  ...todo,
                  __typename: 'Todo',
                };
                console.log('optimistic.updateTodo', result);
                return result;
              },
              removeTodo: (id) => {
                console.log('optimistic.removeTodo', id);
                return id;
              },
            },

            updates: {
              Mutation: {
                createTodo: (result, args, cache) => {
                  console.log('updates.createTodo', result);
                  cache.updateQuery({ query: GET_TODOS }, (data) => {
                    const getTodos = [...(data?.getTodos ?? []), result.createTodo];
                    console.log('updates.createTodo, updating getTodos query to', getTodos);
                    return { ...data, getTodos };
                  });
                },
                removeTodo(result, args, cache, _info) {
                  const todo = {
                    __typename: 'Todo',
                    id: args.id as string,
                  };
                  console.log('updates.removeTodo invalidating', todo);
                  cache.invalidate(todo);
                },
              },
            },
          }),

          setContextExchange(async (operation) => {
            const origFetchOptions =
              typeof operation.context.fetchOptions === 'function'
                ? operation.context.fetchOptions()
                : operation.context.fetchOptions || {};
            const fetchOptions = {
              ...origFetchOptions,
              headers: { ...origFetchOptions.headers },
            };
            return { ...operation.context, fetchOptions };
          }),

          fetchExchange,
        ],
      }),
    []
  );

  return <Provider value={client}>{props.children}</Provider>;
};
