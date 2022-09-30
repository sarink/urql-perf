import { ApolloProvider } from 'ApolloProvider';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { TodosPage } from 'Todos';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ApolloProvider>
        <TodosPage />
      </ApolloProvider>
    </BrowserRouter>
  );
};
