import { Module } from '@nestjs/common';
import { RateService } from './rate.service';
import { HttpModule } from '@nestjs/axios';
import { RateResolver } from './rate.resolver';
import { HistoricalRateService } from './historical-rate.service';
import { CryptowatchRateService } from './cryptowatch.rate.service';

@Module({
  providers: [
    RateService,
    RateResolver,
    HistoricalRateService,
    CryptowatchRateService,
  ],
  imports: [HttpModule],
  exports: [RateService, HistoricalRateService],
})
export class RateModule {}
