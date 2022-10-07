import React, { ReactElement } from 'react';
import { Layout } from './Layout';

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
  return (
    <Layout subtitle={'New order'}>
      <p>
        Here are the details of you new order of{' '}
        <b>
          {props.currency} {props.amount}
        </b>{' '}
        to {props.redactedCryptoAddress} :
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
