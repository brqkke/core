import React from 'react';
import { Layout } from './Layout';
import { useTranslation } from 'react-i18next';

export const LoginLinkEmailContent = (props: { url: string }) => {
  const { t } = useTranslation();
  return (
    <Layout subtitle={t('email.login.subtitle')}>
      <p>
        {t('email.login.body1')}
        <br />
        {t('email.login.body2')}
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
          {t('email.login.action')}
        </a>
        <br />
        <a href={props.url}>{props.url}</a>
      </p>
    </Layout>
  );
};
