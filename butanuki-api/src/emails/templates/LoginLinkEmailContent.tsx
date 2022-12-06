import React from 'react';
import { Layout } from './Layout';

export const LoginLinkEmailContent = (props: { url: string }) => {
  return (
    <Layout subtitle={'Login link'}>
      <h3>ENGLISH</h3>
      <p>
        Please click the link below to log into your account.
        <br />
        If link doesn't work, copy-paste the full address in your browser.
      </p>
      <h3>FRANÇAIS</h3>
      <p>
        Cliquez sur le lien ci-dessous pour accéder à votre compte.
        <br />
        Si le lien ne fonctionne pas, copiez et collez l'adresse complète dans
        votre navigateur.
      </p>
      <p>
        <a
          href={props.url}
          style={{
            backgroundColor: '#4CAF50',
            display: 'inline-block',
            padding: '0.8em 1em',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '0.5em',
            margin: '1em 0em',
          }}
        >
          Login
        </a>
        <br />
        <a href={props.url}>{props.url}</a>
      </p>
    </Layout>
  );
};
