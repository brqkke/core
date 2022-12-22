import React from 'react';
import { Layout } from './Layout';
import { Trans, useTranslation } from 'react-i18next';
import { OrderCurrency } from '../../entities/enums/OrderCurrency';

export const BityOrderCancelled = ({
  transferLabel,
  amount,
  currency,
  orderName,
  vaultName,
  address,
  appUrl,
}: {
  transferLabel: string;
  currency: OrderCurrency;
  amount: number;
  orderName: string;
  vaultName: string;
  address: string;
  appUrl: string;
}) => {
  const { t } = useTranslation();
  return (
    <Layout
      subtitle={t('email.order_cancelled.subtitle', { ref: transferLabel })}
    >
      <Trans
        i18nKey="email.order_cancelled.body"
        t={t}
        values={{
          orderName,
          vaultName,
          amount,
          currency,
          address,
          transferLabel,
        }}
        components={{
          b: <b />,
        }}
      >
        We're sorry to inform you your order
        <b>
          <>
            🐽{{ vaultName }} - 🔄{{ orderName }}
          </>
        </b>
        of
        <b>
          <>
            {{ currency }} {{ amount }}
          </>
        </b>{' '}
        to {{ address }} was cancelled by Bity. Ref: {{ transferLabel }}
      </Trans>
      <p>{t('email.order_cancelled.body2')}</p>
      <a href={appUrl}>{t('email.order_cancelled.login')}</a>
      <p>{t('email.order_cancelled.body3', { transferLabel })}</p>
    </Layout>
  );
};
