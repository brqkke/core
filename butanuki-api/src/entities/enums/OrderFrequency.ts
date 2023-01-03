import { registerEnumType } from '@nestjs/graphql';

export enum OrderFrequency {
  UNIQUE = 'UNIQUE',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
}

registerEnumType(OrderFrequency, { name: 'OrderFrequency' });
