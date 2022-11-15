import React from 'react';
import { I18nextProvider, useSSR } from 'react-i18next';
import i18next, { Resource } from 'i18next';

export const EmailEnveloppe = ({
  children,
  initialI18nStore,
  initialLanguage,
}: React.PropsWithChildren<{
  initialI18nStore: Resource;
  initialLanguage: string;
}>) => {
  const i18nInstance = i18next.cloneInstance({ lng: initialLanguage });
  return (
    <I18nextProvider i18n={i18nInstance}>
      <Email
        initialLanguage={initialLanguage}
        initialI18nStore={initialI18nStore}
      >
        {children}
      </Email>
    </I18nextProvider>
  );
};

const Email = ({
  children,
  initialI18nStore,
  initialLanguage,
}: React.PropsWithChildren<{
  initialI18nStore: Resource;
  initialLanguage: string;
}>) => {
  useSSR(initialI18nStore, initialLanguage);
  return <>{children}</>;
};
