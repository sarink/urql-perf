import React from 'react';
import { Link } from 'react-router-dom';

export const Layout: React.FC = (props) => {
  return (
    <div style={{ padding: 16 }}>
      <nav style={{ marginBottom: 32 }}>
        <Link to="/dashboard" style={{ marginRight: 16 }}>
          Dashboard
        </Link>
        <Link to="/plan">Plan</Link>
        <hr />
      </nav>
      <main>{props.children}</main>
    </div>
  );
};
