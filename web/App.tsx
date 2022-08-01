import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Todos } from 'Todos';
import { UrqlProvider } from 'UrqlProvider';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <UrqlProvider>
        <Todos />
      </UrqlProvider>
    </BrowserRouter>
  );
};
