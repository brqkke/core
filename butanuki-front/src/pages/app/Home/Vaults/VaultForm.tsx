import {
  OrderCurrency,
  useAddVaultMutation,
  VaultInfosFragmentDoc,
  VaultInput,
} from "../../../../generated/graphql";
import { ChangeEvent, FormEvent, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useUserContext } from "../../../../context/UserContext";
import { LoadingBtn } from "../../../../components/buttons/LoadingBtn";
import { Alert } from "../../../../components/alerts/Alert";

interface Props {
  onSave: () => void;
  cancel: () => void;
}

export const VaultForm = ({ onSave, cancel }: Props) => {
  const user = useUserContext();
  const [addVault, addResult] = useAddVaultMutation({
    update: (cache, { data }) => {
      if (!data?.addVault) {
        return;
      }
      cache.modify({
        id: cache.identify(user),
        fields: {
          vaults: (existingVaults = []) => {
            const newVaultRef = cache.writeFragment({
              data: data?.addVault,
              fragment: VaultInfosFragmentDoc,
              fragmentName: "VaultInfos",
            });
            return [...existingVaults, newVaultRef];
          },
        },
      });
    },
  });

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
    async (ev: FormEvent<HTMLFormElement>) => {
      ev.preventDefault();
      await addVault({
        variables: {
          data: {
            name: input.name,
            currency: input.currency,
          },
        },
      });
      onSave();
    },
    [onSave, addVault, input]
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
      <div className="row">
        <div className="col-12 btn-toolbar justify-content-end">
          <div className="btn-group me-2">
            <button
              onClick={cancel}
              name="cancel"
              type={"button"}
              className={"btn"}
            >
              {t("app.action.cancel")}
            </button>
          </div>
          <div className="btn-group">
            <LoadingBtn
              level={"success"}
              text={t("app.action.submit")}
              loading={addResult.loading}
              type={"submit"}
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export const VaultFormCard = ({
  totalCurrentVaults,
  maxVaults,
  disabled,
}: {
  disabled: boolean;
  totalCurrentVaults: number;
  maxVaults: number;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const closeForm = useCallback(() => setIsOpen(false), []);
  const openForm = useCallback(() => setIsOpen(true), []);

  return isOpen ? (
    <div className="row">
      <div className="col-md-6">
        <div className="card">
          <div className="card-body">
            <VaultForm onSave={closeForm} cancel={closeForm} />
          </div>
        </div>
      </div>
    </div>
  ) : totalCurrentVaults < maxVaults ? (
    <button
      className={"btn btn-success"}
      disabled={disabled}
      onClick={openForm}
    >
      {t("app.vault.add")}
    </button>
  ) : (
    <Alert
      level={"warning"}
      message={t("app.vault.maxReached", { max: maxVaults })}
    />
  );
};
