import { Module } from '@nestjs/common';
import { RateService } from './rate.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  providers: [RateService],
  imports: [HttpModule],
  exports: [RateService],
})
export class RateModule {}
