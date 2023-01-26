import { registerEnumType } from '@nestjs/graphql';

export enum OrderStatus {
  TO_CANCEL = 'TO_CANCEL', //not used
  OPEN = 'OPEN',
  FILLED = 'FILLED',
  FILLED_NEED_RENEW = 'FILLED_NEED_RENEW',
  CANCELLED_NEED_RENEW = 'CANCELLED_NEED_RENEW', //not used
  CANCELLED = 'CANCELLED',
}

registerEnumType(OrderStatus, { name: 'OrderStatus' });
