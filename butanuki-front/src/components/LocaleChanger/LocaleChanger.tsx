import { useTranslation } from "react-i18next";
import { useConfigContext } from "../../context/ConfigContext";
import React, { useCallback, useId } from "react";
import { useUpdateLocaleMutation } from "../../generated/graphql";
import { setLangCookie } from "../../utils/i18n";

import Dropdown from "react-bootstrap/Dropdown";

function Selector({
  current,
  options,
  onChange,
}: {
  current: string;
  options: string[];
  onChange: (locale: string) => void;
}) {
  const id = useId();
  return (
    <Dropdown>
      <Dropdown.Toggle variant="outline-success" id={id}>
        {current.toUpperCase()}{" "}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {options.map((locale) => {
          return (
            <Dropdown.Item onClick={() => onChange(locale)} key={locale}>
              {locale.toUpperCase()}
            </Dropdown.Item>
          );
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export const LocaleChanger = React.memo(
  ({ logged = false }: { logged?: boolean }) => {
    const { i18n } = useTranslation();
    const [updateLocale] = useUpdateLocaleMutation();
    const { availableLocales } = useConfigContext();

    const handleChange = useCallback(
      async (locale: string) => {
        if (logged) {
          await updateLocale({ variables: { locale: locale } });
        }
        i18n.changeLanguage(locale);
        setLangCookie(locale);
      },
      [i18n, logged, updateLocale]
    );

    return (
      <div className={"mt-3"}>
        <Selector
          current={i18n.language}
          onChange={handleChange}
          options={availableLocales}
        />
      </div>
    );
  }
);
