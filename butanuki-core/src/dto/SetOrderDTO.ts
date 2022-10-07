import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { OrderCurrency } from '../entities/enums/OrderCurrency';

export class SetOrderDTO {
  @ApiProperty()
  @IsNumber({ allowInfinity: false, allowNaN: false })
  amount: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  cryptoAddress?: string;

  @ApiProperty()
  @IsEnum(OrderCurrency)
  currency: OrderCurrency;
}
