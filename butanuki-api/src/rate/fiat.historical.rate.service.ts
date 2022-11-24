import { DataSource } from 'typeorm';
import { buildRepositories, Repositories } from '../utils';
import { OrderCurrency } from '../entities/enums/OrderCurrency';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AppConfigService } from '../config/app.config.service';

@Injectable()
export class FiatHistoricalRateService {
  private db: Repositories;
  constructor(
    db: DataSource,
    private http: HttpService,
    private appConfig: AppConfigService,
  ) {
    this.db = buildRepositories(db.manager);
  }
  public async initializePastRates() {
    const start = 2012;
    const end = new Date().getFullYear();
    const years = Array.from({ length: end - start + 1 }, (_, i) => i + start);
    const currencies: OrderCurrency[] = Object.values(OrderCurrency);
    for (const year of years) {
      const url = 'https://api.apilayer.com/exchangerates_data/timeseries';
      const response = await firstValueFrom(
        this.http.get<
          | {
              success: true;
              rates: { [k in string]: { [c in OrderCurrency]: number } };
            }
          | { error: any }
        >(url, {
          params: {
            start_date: `${year}-01-01`,
            end_date: `${year}-12-31`,
            base: 'BTC',
            symbols: currencies.join(','),
          },
          headers: {
            apikey: this.appConfig.config.exchangeRateData.apiKey,
          },
        }),
      );
      if ('error' in response.data) {
        console.log(response.data.error);
        throw new Error(response.data.error);
      }
      const rates = response.data.rates;
      const ratesToInsert = Object.entries(rates).flatMap(([date, rates]) => {
        return Object.entries(rates).map(([currency, rate]) => {
          return this.db.historicalRate.create({
            rate,
            currency: currency as OrderCurrency,
            timestamp: new Date(date),
          });
        });
      });
      await this.db.historicalRate.save(ratesToInsert);
    }
  }
}
