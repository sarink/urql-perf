import React from 'react';
import { gql, useQuery } from 'urql';

const GetDashboardDocument = gql`
  query GetDashboard {
    getBits {
      ...DashboardBitParts
    }
    getTransactions {
      ...DashboardTransactionParts
    }
  }

  fragment DashboardBitParts on Bit {
    id
    name
    index
    transactions {
      id
    }
  }

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

export const Dashboard: React.FC = () => {
  const [{ data }] = useQuery({ query: GetDashboardDocument });
  console.log(data);
  return <div>dashboard</div>;
};
