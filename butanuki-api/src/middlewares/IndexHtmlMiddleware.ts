import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { STATIC_PATH } from '../app.module';
import * as fs from 'fs/promises';
import path from 'path';
import { DCACConfigs } from '../dca-estimator/dca-estimator.resolver';
import { DCAInterval, ItemType } from '../dca-estimator/types';
import { I18nService } from '../i18n/i18n.service';
import { ServerResponse } from 'http';

@Injectable()
export class IndexHtmlMiddleware implements NestMiddleware {
  private cachedIndexHtml: { [key: string]: string } = {};

  constructor(private i18n: I18nService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    this.addConfigPreloadHeader(req, res);
    if (!req.originalUrl.startsWith('/savings')) {
      return next();
    }
    res.send(await this.handlesSavingsPage(req));
    return next();
  }

  public addConfigPreloadHeader(req: Request, res: ServerResponse) {
    if (req.url.startsWith('/api')) {
      return;
    }
    const url = new URL(req.url, req.protocol + '://' + req.headers.host);
    const lang = url.searchParams.get('lang');
    const langQueryString =
      !!lang && this.i18n.isLanguageSupported(lang) ? `?lang=${lang}` : '';

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader(
      'Link',
      `</api/config${langQueryString}>; rel="preload"; as="fetch"`,
    );
  }

  private async handlesSavingsPage(req: Request) {
    const url = new URL(req.url, req.protocol + '://' + req.headers.host);

    const isOther = url.searchParams.get('slug') === 'custom';

    const config = isOther
      ? {
          slug: 'custom',
          type: ItemType.OTHER,
          price: 10, //POOP emoji
          emojis: '',
          interval: DCAInterval.DAILY, //placeholder
        }
      : DCACConfigs.find((c) => c.slug === url.searchParams.get('slug')) ||
        DCACConfigs[0];

    if (!this.cachedIndexHtml[config.slug]) {
      const content = (
        await fs.readFile(path.join(STATIC_PATH, '/index.html'), 'utf8')
      ).toString();

      const metatags = {
        title: 'Butanuki - How much Bitcoin could I own today?',
        description: 'If I had bought €10 worth of bitcoin instead of...',
        image: `https://butanuki.com/img/${config.slug}.jpg`,
      };

      const meta: { name?: string; property?: string; value: string }[] = [];
      meta.push({ name: 'description', value: metatags.description });
      Object.entries(metatags).forEach(([key, value]) => {
        meta.push({ name: 'twitter:' + key, value });
      });
      meta.push({ name: 'twitter:card', value: 'summary_large_image' });
      meta.push({ name: 'twitter:site', value: '@Butanuki21' });
      meta.push({ name: 'twitter:creator', value: '@Butanuki21' });
      Object.entries(metatags).forEach(([key, value]) => {
        meta.push({ property: 'og:' + key, value });
      });

      //Add twitter card meta tags
      this.cachedIndexHtml[config.slug] = this.replaceBetween(
        content,
        meta
          .map((m) => {
            return `<meta ${m.name ? 'name="' + m.name + '"' : ''}${
              m.property ? 'property="' + m.property + '"' : ''
            } content="${m.value}">`;
          })
          .join('\n'),
        // add og: meta tags
      );
    }
    return this.cachedIndexHtml[config.slug];
  }

  /**
   * Replaces the content between <!--__META__--> and <!--/__META__--> with the given content
   */
  private replaceBetween(source: string, content: string) {
    const patternStart = '<!--__META__-->';
    const patternEnd = '<!--/__META__-->';
    const start = source.indexOf(patternStart);
    const end = source.indexOf(patternEnd) + patternEnd.length;
    return source.substring(0, start) + content + source.substring(end);
  }
}
