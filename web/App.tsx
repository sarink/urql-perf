import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { TodosPage } from 'Todos';
import { UrqlProvider } from 'UrqlProvider';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <UrqlProvider>
        <TodosPage />
      </UrqlProvider>
    </BrowserRouter>
  );
};
