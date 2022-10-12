import { registerEnumType } from '@nestjs/graphql';

export enum OrderCurrency {
  CHF = 'CHF',
  EUR = 'EUR',
}

registerEnumType(OrderCurrency, { name: 'OrderCurrency' });
