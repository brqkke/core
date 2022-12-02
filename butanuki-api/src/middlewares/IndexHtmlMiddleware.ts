import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { STATIC_PATH } from '../app.module';
import * as fs from 'fs/promises';
import path from 'path';
import { DCACConfigs } from '../dca-estimator/dca-estimator.resolver';
import { DCAInterval, ItemType } from '../dca-estimator/types';

@Injectable()
export class IndexHtmlMiddleware implements NestMiddleware {
  private cachedIndexHtml: { [key: string]: string } = {};

  async use(req: Request, res: Response, next: NextFunction) {
    if (!req.url.startsWith('/savings')) {
      return next();
    }
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

    res.header('Content-Type', 'text/html');
    res.header('Link', '</api/config>; rel="preload"; as="fetch"');

    if (!this.cachedIndexHtml[config.slug]) {
      const content = (
        await fs.readFile(path.join(STATIC_PATH, '/index.html'), 'utf8')
      ).toString();

      //Add twitter card meta tags
      this.cachedIndexHtml[config.slug] = this.replaceBetween(
        content,
        `<meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@Butanuki21">
    <meta name="twitter:creator" content="@Butanuki21">
    <meta name="twitter:title" content="Butanuki - How much Bitcoin could I own today?">
    <meta name="twitter:description" content="If I had bought €10 worth of Bitcoin...">
    <meta name="twitter:image" content="https://butanuki.com/img/${config.slug}.jpg">`,
      );
    }

    res.send(this.cachedIndexHtml[config.slug]);
    return next();
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
