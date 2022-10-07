export function PaymentDetails(props: {
  iban: string;
  swift_bic: string;
  recipient: string;
  account_number: string;
  bank_code: string;
  bank_address: string;
}) {
  return (
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
    </p>
  );
}
