import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { OrderCurrency } from '../entities/enums/OrderCurrency';
import { firstValueFrom } from 'rxjs';

type CloseTime = number;
type OpenPrice = number;
type HighPrice = number;
type LowPrice = number;
type ClosePrice = number;
type Volume = number;
type QuoteVolum = number;

type Holc = [
  CloseTime,
  OpenPrice,
  HighPrice,
  LowPrice,
  ClosePrice,
  Volume,
  QuoteVolum,
];

type Intervals =
  | '60'
  | '180'
  | '300'
  | '900'
  | '1800'
  | '3600'
  | '7200'
  | '14400'
  | '21600'
  | '43200'
  | '86400'
  | '259200'
  | '604800'
  | '604800_Monday';
type Response<I extends Intervals> = {
  result?: {
    [key in I]: Holc[];
  };
};

@Injectable()
export class CryptowatchRateService {
  private cryptowatchUrl = 'https://api.cryptowat.ch/markets/kraken/:pair/ohlc';

  constructor(private httpService: HttpService) {}

  private getUrl(
    currency: OrderCurrency,
    [start, end]: [number, number],
    interval: Intervals = '86400',
  ): string {
    return (
      this.cryptowatchUrl.replace(':pair', `btc${currency.toLowerCase()}`) +
      `?periods=${interval}&after=${start}&before=${end}`
    );
  }

  public fetchRates<I extends Intervals>(
    currency: OrderCurrency,
    interval: I,
    [start, end]: [number, number],
  ): Promise<Response<I>> {
    return firstValueFrom(
      this.httpService.get<Response<I>>(
        this.getUrl(currency, [start, end], interval),
      ),
    ).then((response) => response.data);
  }
}
