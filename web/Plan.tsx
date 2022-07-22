import { Layout } from 'Layout';
import React from 'react';
import { gql, useQuery } from 'urql';

export const PlanBitParts = gql`
  fragment PlanBitParts on Bit {
    id
    name
    index
    transactions {
      id
    }
  }
`;

export const PlanTransactionParts = gql`
  fragment PlanTransactionParts on Transaction {
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

const GetPlanDocument = gql`
  query GetPlan {
    getBits {
      ...PlanBitParts
    }
    getTransactions {
      ...PlanTransactionParts
    }
  }
  ${PlanBitParts}
  ${PlanTransactionParts}
`;

export const Plan: React.FC = () => {
  const [{ data, fetching, error }] = useQuery({ query: GetPlanDocument });

  if (error) return <Layout>Error loading plan</Layout>;
  if (fetching || !data) return <Layout>Loading plan...</Layout>;

  const numBits = data.getBits.length;
  const numTransactions = data.getTransactions.length;

  return (
    <Layout>
      <h3>Plan</h3>
      transactions: {numTransactions}
      <br />
      bits: {numBits}
    </Layout>
  );
};
