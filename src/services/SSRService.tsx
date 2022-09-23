import { Injectable } from '@nestjs/common';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

@Injectable()
export class SSRService {
  render<Props extends {}>(Element: React.FC<Props>, props: Props) {
    return renderToStaticMarkup(<Element {...props} />);
  }
}
