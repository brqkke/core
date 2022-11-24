import { Module } from '@nestjs/common';
import { RateService } from './rate.service';
import { HttpModule } from '@nestjs/axios';
import { RateResolver } from './rate.resolver';
import { HistoricalRateService } from './historical-rate.service';
import { CryptowatchRateService } from './cryptowatch.rate.service';
import { FiatHistoricalRateService } from './fiat.historical.rate.service';
import { AppConfigModule } from '../config/config.module';

@Module({
  providers: [
    RateService,
    RateResolver,
    HistoricalRateService,
    CryptowatchRateService,
    FiatHistoricalRateService,
  ],
  imports: [HttpModule, AppConfigModule],
  exports: [RateService, HistoricalRateService, FiatHistoricalRateService],
})
export class RateModule {}
