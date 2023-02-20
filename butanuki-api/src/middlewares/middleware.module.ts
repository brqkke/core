import { Module } from '@nestjs/common';
import { IndexHtmlMiddleware } from './IndexHtmlMiddleware';
import { I18nModule } from '../i18n/i18n.module';

@Module({
  exports: [IndexHtmlMiddleware],
  providers: [IndexHtmlMiddleware],
  imports: [I18nModule],
})
export class MiddlewareModule {}
