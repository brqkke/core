import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { OrderCurrency } from '../entities/enums/OrderCurrency';
import { firstValueFrom } from 'rxjs';
import { DataSource } from 'typeorm';
import { buildRepositories, Repositories } from '../utils';

interface RateResponse {
  pair: string;
  rate: string;
}

@Injectable()
export class RateService {
  private getUrl(currency: OrderCurrency): string {
    return `https://bity.com/api/v1/rate2/BTC${currency}/`;
  }

  private db: Repositories;

  constructor(private http: HttpService, db: DataSource) {
    this.db = buildRepositories(db.manager);
  }

  private async fetchRate(currency: OrderCurrency): Promise<RateResponse> {
    const url = this.getUrl(currency);
    const response = await firstValueFrom(this.http.get(url));
    return response.data;
  }

  async getRate(currency: OrderCurrency): Promise<number> {
    const rate = await this.fetchRate(currency);
    return parseFloat(rate.rate);
  }

  async getCachedRate(currency: OrderCurrency): Promise<number> {
    const rate = await this.db.rate.findOne({
      where: { currency },
    });
    if (rate) {
      if (rate.updatedAt.getTime() < Date.now() - 1000 * 60 * 60) {
        // 1 hour
        await this.updateRates();
        return this.getCachedRate(currency);
      }
      return rate.rate;
    }
    return this.getRate(currency);
  }

  async getRates(): Promise<{ currency: OrderCurrency; rate: number }[]> {
    return Promise.all(
      Object.values(OrderCurrency).map(async (currency) => ({
        currency,
        rate: await this.getRate(currency),
      })),
    );
  }

  async updateRates(): Promise<void> {
    const rates = await this.getRates();
    console.log(rates);
    await Promise.all(
      rates.map(async (rate) => {
        await this.db.rate.upsert(
          {
            currency: rate.currency,
            rate: rate.rate,
            updatedAt: new Date(),
          },
          { conflictPaths: ['currency'] },
        );
      }),
    );
  }
}
