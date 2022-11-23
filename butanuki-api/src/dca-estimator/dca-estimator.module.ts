import { Module } from '@nestjs/common';
import { DcaEstimatorService } from './dca-estimator.service';
import { DcaEstimatorResolver } from './dca-estimator.resolver';
import { HttpModule } from '@nestjs/axios';
import { RateModule } from '../rate/rate.module';

@Module({
  providers: [DcaEstimatorService, DcaEstimatorResolver],
  imports: [HttpModule, RateModule],
})
export class DcaEstimatorModule {}
