import { gql, useApolloClient, useMutation, useQuery } from '@apollo/client';
import { uniqueId } from 'lodash';
import React, { useMemo, useState } from 'react';

export const GET_TODOS = gql`
  query GetTodos {
    getTodos {
      id
      name
      done
    }
  }
`;

const CREATE_TODO = gql`
  mutation CreateTodo($name: String!, $done: Boolean!) {
    createTodo(name: $name, done: $done) {
      id
      name
      done
    }
  }
`;

const UPDATE_TODO = gql`
  mutation UpdateTodo($id: ID!, $name: String, $done: Boolean) {
    updateTodo(id: $id, name: $name, done: $done) {
      id
      name
      done
    }
  }
`;

const REMOVE_TODO = gql`
  mutation RemoveTodo($id: ID!) {
    removeTodo(id: $id)
  }
`;

type Todo = { id: string; name: string; done: boolean };

export const TodosPage: React.FC = () => {
  const { data, error, loading: fetching } = useQuery(GET_TODOS);
  const todos = useMemo(() => {
    console.log('rebuilding todos', data?.getTodos);
    return data?.getTodos ?? [];
  }, [data?.getTodos]);
  if (error) return <div>Error :(</div>;
  if (fetching) return <div>Loading...</div>;
  return <TodosList todos={todos} />;
};

const TodosList: React.FC<{ todos: Todo[] }> = React.memo(({ todos }) => {
  console.log('rendering todos list');
  return (
    <div>
      <h3>Showing {todos.length} todos</h3>
      <hr />
      <CreateTodo />
      <br />
      <br />
      {todos.map((todo) => (
        <Todo todo={todo} key={todo.id} />
      ))}
    </div>
  );
});

const Todo: React.FC<{ todo: Todo }> = React.memo(({ todo }) => {
  const [updateTodo] = useMutation(UPDATE_TODO);
  // const [removeTodo] = useMutation(REMOVE_TODO);
  const { id, name, done } = todo;
  console.log('rendering todo', id, name);
  return (
    <div
      style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', width: 300 }}
    >
      <input
        type="text"
        defaultValue={name}
        onBlur={(e) => {
          const name = e.target.value;
          updateTodo({
            variables: { id, name },
            optimisticResponse: {
              __typename: 'Todo',
              id,
              name,
              done,
            },
          });
        }}
      />
      <input
        type="checkbox"
        checked={done}
        onChange={(e) => {
          const done = e.target.checked;
          updateTodo({
            variables: { id, done },
            optimisticResponse: {
              __typename: 'Todo',
              id,
              name,
              done,
            },
          });
        }}
      />
      {/* <button onClick={() => removeTodo({ variables: { id: todo.id } })}>Remove</button> */}
    </div>
  );
});

const CreateTodo: React.FC = () => {
  const client = useApolloClient();
  const [createTodo] = useMutation(CREATE_TODO, {
    update: (cache, { data }) => {
      cache.modify({
        fields: {
          getTodos: (existingTodos = []) => {
            const newTodoRef = cache.writeFragment({
              data: data.createTodo,
              fragment: gql`
                fragment NewTodo on Todo {
                  __typename
                  name
                  done
                }
              `,
            });
            return existingTodos.concat(newTodoRef);
          },
        },
      });
    },
  });
  const [name, setName] = useState('');
  const [done, setDone] = useState(false);
  return (
    <div
      style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', width: 300 }}
    >
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="checkbox" checked={done} onChange={(e) => setDone(e.target.checked)} />
      <button
        onClick={() => {
          createTodo({
            variables: { name, done },
            optimisticResponse: {
              createTodo: {
                __typename: 'Todo',
                id: uniqueId('temp-todo-'),
                name,
                done,
              },
            },
          });
          setName('');
          setDone(false);
        }}
      >
        Create
      </button>
    </div>
  );
};
