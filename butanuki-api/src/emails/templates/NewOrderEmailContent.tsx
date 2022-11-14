import React, { ReactElement } from 'react';
import { Layout } from './Layout';
import { Trans, useTranslation } from 'react-i18next';

export const NewOrderEmailContent = (props: {
  iban: string;
  swift_bic: string;
  recipient: string;
  account_number?: string;
  bank_code?: string;
  bank_address?: string;
  redactedCryptoAddress: string;
  reference: string;
  amount: number;
  currency: string;
}): ReactElement<{}> => {
  const { t } = useTranslation();
  return (
    <Layout subtitle={t('email.new_order.subtitle')}>
      <p>
        <Trans
          t={t}
          i18nKey={'email.new_order.body'}
          values={{
            amount: props.amount,
            currency: props.currency,
            address: props.redactedCryptoAddress,
          }}
        >
          Here are the details of you new order of
          <b>
            <>
              {{ currency: props.currency }} {{ amount: props.amount }}
            </>
          </b>{' '}
          to {{ address: props.redactedCryptoAddress }} :
        </Trans>
      </p>
      <p>
        IBAN : <b>{props.iban}</b>
        <br />
        BIC/SWIFT : <b>{props.swift_bic}</b>
        <br />
        Recipient : <b>{props.recipient}</b>
        <br />
        {!!props.account_number && (
          <>
            Account number : <b>{props.account_number}</b>
            <br />
          </>
        )}
        {!!props.bank_code && (
          <>
            Bank Code : <b>{props.bank_code}</b>
            <br />
          </>
        )}
        {!!props.bank_address && (
          <>
            Bank Address : <b>{props.bank_address}</b>
            <br />
          </>
        )}
        <>
          Reference : <b>{props.reference}</b>
          <br />
        </>
      </p>
    </Layout>
  );
};
