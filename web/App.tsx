import { Dashboard } from 'Dashboard';
import { Plan } from 'Plan';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { UrqlProvider } from 'UrqlProvider';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <UrqlProvider>
        <Routes>
          <Route path="/plan" element={<Plan />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </UrqlProvider>
    </BrowserRouter>
  );
};
