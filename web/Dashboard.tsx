import { Layout } from 'Layout';
import React from 'react';
import { gql, useQuery } from 'urql';

export const DashboardBitParts = gql`
  fragment DashboardBitParts on Bit {
    id
    name
    index
    transactions {
      id
    }
  }
`;

export const DashboardTransactionParts = gql`
  fragment DashboardTransactionParts on Transaction {
    id
    date
    name
    amount
    bit {
      id
    }
    account {
      id
      plaidItem {
        id
        institution {
          id
        }
      }
    }
  }
`;

const GetDashboardDocument = gql`
  query GetDashboard {
    getBits {
      ...DashboardBitParts
    }
    getTransactions {
      ...DashboardTransactionParts
    }
  }
  ${DashboardBitParts}
  ${DashboardTransactionParts}
`;

export const Dashboard: React.FC = () => {
  const [{ data, fetching, error }] = useQuery({ query: GetDashboardDocument });

  if (error) return <Layout>Error loading dashboard</Layout>;
  if (fetching || !data) return <Layout>Loading dashboard...</Layout>;

  const numBits = data.getBits.length;
  const numTransactions = data.getTransactions.length;

  return (
    <Layout>
      <h3>Dashboard</h3>
      transactions: {numTransactions}
      <br />
      bits: {numBits}
    </Layout>
  );
};
