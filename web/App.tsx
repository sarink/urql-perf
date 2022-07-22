import { Dashboard } from 'Dashboard';
import React from 'react';
import { UrqlProvider } from 'UrqlProvider';

export const App: React.FC = () => {
  return (
    <UrqlProvider>
      <Dashboard />
    </UrqlProvider>
  );
};
