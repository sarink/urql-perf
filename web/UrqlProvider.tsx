import { devtoolsExchange } from '@urql/devtools';
import { Cache, cacheExchange } from '@urql/exchange-graphcache';
import { IntrospectionData } from '@urql/exchange-graphcache/dist/types/ast';
import React, { useMemo } from 'react';
import { isPresent } from 'ts-is-present';
import {
  createClient,
  dedupExchange,
  Exchange,
  fetchExchange,
  gql,
  Operation,
  Provider,
} from 'urql';
import { fromPromise, map, mergeMap, pipe } from 'wonka';

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

const schema = {};

export const UrqlProvider: React.FC = (props) => {
  const client = useMemo(
    () =>
      createClient({
        url: `http://localhost:3001/graphql`,
        maskTypename: true,
        exchanges: [
          devtoolsExchange,
          dedupExchange,
          cacheExchange(),
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
