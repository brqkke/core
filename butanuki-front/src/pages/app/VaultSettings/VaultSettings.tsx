import { Navigate, useNavigate, useParams } from "react-router";
import React, { FormEventHandler, useCallback, useState } from "react";
import {
  useUpdateVaultMutation,
  useVaultQuery,
} from "../../../generated/graphql";
import { useTranslation } from "react-i18next";
import { LoadingBtn } from "../../../components/buttons/LoadingBtn";
import { LoadingCard } from "../../../components/LoadingCard";
import { LoggedLayout } from "../../../layout/LoggedLayout";
import { useDebounce } from "../../../utils/hooks";

export const VaultSettings = React.memo(() => {
  const { vaultId } = useParams<{
    vaultId?: string;
  }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [name, setName] = useState("");

  const vault = useVaultQuery({
    variables: { id: vaultId || "" },
    skip: !vaultId,
    onCompleted: (data) => {
      setName(data.vault.name);
    },
  });

  const [updateVault, { loading: updateLoading }] = useUpdateVaultMutation({
    variables: {
      id: vaultId || "",
      data: { name },
    },
    onCompleted: () => {
      navigate("/");
    },
  });

  const onSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    (e) => {
      e.preventDefault();
      updateVault();
      return false;
    },
    [updateVault]
  );

  const vaultLoading = useDebounce(vault.loading, 100, true);

  if (!vaultId) {
    return <Navigate to="/" />;
  }

  if (vaultLoading) {
    return (
      <LoggedLayout>
        <div className="row">
          <div className="col-md-12">
            <LoadingCard />
          </div>
        </div>
      </LoggedLayout>
    );
  }

  return (
    <LoggedLayout>
      <div className="row">
        <div className="col-md-12">
          <div className="card mb-4">
            <div className="card-header">
              <h3>
                {t("app.vault.editing", { name: vault.data?.vault.name })}
              </h3>
            </div>
            <div className="card-body">
              <form onSubmit={onSubmit}>
                <div className="form-group">
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        {t("app.vault.name")}
                      </span>
                    </div>
                    <input
                      className={"form-control"}
                      onChange={(ev) => {
                        setName(ev.target.value);
                      }}
                      value={name}
                      placeholder={t("app.vault.name_placeholder")}
                    />
                  </div>
                </div>
                <br />

                <button
                  type={"button"}
                  className={"btn btn-secondary"}
                  onClick={() => {
                    navigate("/");
                  }}
                >
                  {t("app.order.go_back")}
                </button>
                <LoadingBtn
                  level={"primary"}
                  text={t("app.order.save")}
                  loading={updateLoading}
                  type={"submit"}
                  className={"ms-2"}
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    </LoggedLayout>
  );
});
