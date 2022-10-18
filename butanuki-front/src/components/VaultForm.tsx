import { OrderCurrency, VaultInput } from "../generated/graphql";
import { ChangeEvent, FormEvent, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  onSave: (input: VaultInput) => void;
  cancel: () => void;
  key: string;
}

export const VaultForm = (props: Props) => {
  const [input, setInput] = useState<VaultInput>({
    name: "",
    currency: OrderCurrency.Chf,
  });

  const { t } = useTranslation();

  const handleChange = useCallback(
    <K extends keyof VaultInput>(key: K, value: VaultInput[K]) => {
      setInput((input) => {
        return {
          ...input,
          [key]: value,
        };
      });
    },
    []
  );

  const onNameChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) =>
      handleChange("name", ev.target.value),
    [handleChange]
  );
  const onCurrencyChange = useCallback(
    (ev: ChangeEvent<HTMLSelectElement>) =>
      handleChange("currency", ev.target.value as OrderCurrency),
    [handleChange]
  );
  const onSubmit = useCallback(
    (ev: FormEvent<HTMLFormElement>) => {
      ev.preventDefault();
      props.onSave(input);
    },
    [input, props]
  );

  return (
    <form onSubmit={onSubmit}>
      <div className="mb-3 row">
        <label htmlFor="vaultName" className="col-4 col-form-label">
          {t("app.order.name")}
        </label>
        <div className="col-8">
          <input
            onChange={onNameChange}
            id="vaultName"
            name="vaultName"
            placeholder={t("app.vault.name_placeholder")}
            type="text"
            className="form-control"
            required={true}
          />
        </div>
      </div>
      <div className="mb-3 row">
        <label htmlFor="vaultCurrency" className="col-4 col-form-label">
          {t("app.vault.currency")}
        </label>
        <div className="col-8">
          <select
            defaultValue={input.currency}
            onChange={onCurrencyChange}
            id="vaultCurrency"
            name="vaultCurrency"
            required={true}
            className="form-control"
          >
            <option value="EUR">EUR</option>
            <option value="CHF">CHF</option>
          </select>
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-12 btn-toolbar justify-content-end">
          <div className="btn-group me-2">
            <button
              onClick={props.cancel}
              name="cancel"
              type={"button"}
              className={"btn"}
            >
              {t("app.action.cancel")}
            </button>
          </div>
          <div className="btn-group">
            <button name="submit" type="submit" className="btn btn-primary">
              {t("app.action.submit")}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};
