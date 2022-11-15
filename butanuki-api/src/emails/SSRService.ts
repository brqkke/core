import { Injectable } from '@nestjs/common';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { EmailEnveloppe } from './templates/EmailEnveloppe';
import { I18nService } from '../i18n/i18n.service';

@Injectable()
export class SSRService {
  constructor(private i18nService: I18nService) {}

  render<Props extends object>(
    Element: React.FC<Props>,
    props: Props,
    locale: string,
  ) {
    return renderToStaticMarkup(
      React.createElement(
        EmailEnveloppe,
        {
          initialI18nStore: this.i18nService.getInitialI18nStore(),
          initialLanguage: locale,
        },
        React.createElement(Element, props),
      ),
    );
  }
}
