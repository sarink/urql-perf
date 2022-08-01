import { devtoolsExchange } from '@urql/devtools';
import { offlineExchange } from '@urql/exchange-graphcache';
import { makeDefaultStorage } from '@urql/exchange-graphcache/default-storage';
import { IntrospectionData } from '@urql/exchange-graphcache/dist/types/ast';
import { requestPolicyExchange } from '@urql/exchange-request-policy';
import { uniqueId } from 'lodash';
import React, { useMemo } from 'react';
import { GET_TODOS } from 'Todos';
import { isPresent } from 'ts-is-present';
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
        maskTypename: true,
        exchanges: [
          devtoolsExchange,
          dedupExchange,
          requestPolicyExchange({}),
          offlineExchange({
            schema: schema as any as IntrospectionData,
            storage: makeDefaultStorage({ idbName: `urql-todos` }),
            optimistic: {
              createTodo: (todo) => ({ ...todo, id: uniqueId('todo-'), __typename: 'Todo' }),
              updateTodo: (todo) => ({ ...todo, __typename: 'Todo' }),
            },

            updates: {
              Mutation: {
                createTodo: (result, args, cache) => {
                  console.log('updates', result);
                  cache.updateQuery({ query: GET_TODOS }, (data) => ({
                    ...data,
                    getTodos: [...(data?.getTodos ?? []), result.createTodo],
                  }));
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
        ].filter(isPresent),
      }),
    []
  );

  return <Provider value={client}>{props.children}</Provider>;
};
