import { Controller, Get } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Controller()
export class AppController {
  constructor(private db: DataSource) {}

  @Get('/version')
  version() {
    return { version: process.env.APP_VERSION };
  }

  @Get('/status')
  async status() {
    await this.db.query('SELECT 1');
    return { status: 'ok' };
  }
}
