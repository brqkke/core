import { registerEnumType } from '@nestjs/graphql';

export enum OrderFrequency {
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
}

registerEnumType(OrderFrequency, { name: 'OrderFrequency' });
