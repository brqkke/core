import React from 'react';
import { Layout } from './Layout';
import { Token } from '../../entities/Token';

export const TokenStatusReporting = ({ token }: { token: Token }) => {
  return (
    <Layout subtitle={"Erreur lors du refresh d'un token"}>
      <p>
        Token id: {token.id}
        <br />
        User id : {token.userId}
        <br />
        Tentative de refresh faite le {token.lastRefreshTriedAt?.toISOString()}{' '}
        (UTC)
        <br />
      </p>
    </Layout>
  );
};
