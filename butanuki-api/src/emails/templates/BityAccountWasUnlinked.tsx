import React from 'react';
import { Layout } from './Layout';
import { useTranslation } from 'react-i18next';

export const BityAccountWasUnlinked = ({ appUrl }: { appUrl: string }) => {
  const { t } = useTranslation();
  return (
    <Layout subtitle={t('email.bity_token_broken.subtitle')}>
      <p>{t('email.bity_token_broken.body')}</p>
      <a href={appUrl}>{t('email.bity_token_broken.login')}</a>
    </Layout>
  );
};
