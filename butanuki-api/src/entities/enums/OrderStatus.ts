import { registerEnumType } from '@nestjs/graphql';

export enum OrderStatus {
  TO_CANCEL = 'TO_CANCEL',
  OPEN = 'OPEN',
  FILLED = 'FILLED',
  FILLED_NEED_RENEW = 'FILLED_NEED_RENEW',
  CANCELLED_NEED_RENEW = 'CANCELLED_NEED_RENEW',
  CANCELLED = 'CANCELLED',
}

registerEnumType(OrderStatus, { name: 'OrderStatus' });
