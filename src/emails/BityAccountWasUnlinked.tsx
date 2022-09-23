import React from 'react';
import { Layout } from './Layout';

export const BityAccountWasUnlinked = () => {
  return (
    <Layout subtitle={'Your Bity account was unlinked'}>
      <p>
        You need to link it again in you Butanuki account if you want to keep
        your DCA working.
      </p>
    </Layout>
  );
};
