import React, { useState } from 'react';
import { gql, useMutation, useQuery } from 'urql';

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

type Todo = { id: string; name: string; done: boolean };

export const Todos: React.FC = () => {
  const [{ data, error, fetching }] = useQuery({ query: GET_TODOS });
  if (error) return <div>Error :(</div>;
  if (fetching || !data) return <div>Loading...</div>;
  const todos: Todo[] = data.getTodos ?? [];
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
};

const CreateTodo: React.FC = () => {
  const [, createTodo] = useMutation(CREATE_TODO);
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
          createTodo({ name, done });
          setName('');
          setDone(false);
        }}
      >
        Create
      </button>
    </div>
  );
};

const Todo: React.FC<{ todo: Todo }> = ({ todo }) => {
  const [, updateTodo] = useMutation(UPDATE_TODO);
  const [name, setName] = useState(todo.name);
  const [done, setDone] = useState(!!todo.done);
  return (
    <div
      style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', width: 300 }}
    >
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="checkbox" checked={done} onChange={(e) => setDone(e.target.checked)} />
      <button onClick={() => updateTodo({ id: todo.id, name, done })}>Save</button>
    </div>
  );
};
