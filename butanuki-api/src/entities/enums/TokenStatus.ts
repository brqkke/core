import { registerEnumType } from '@nestjs/graphql';

export enum TokenStatus {
  ACTIVE = 'ACTIVE',
  NEED_REFRESH_RETRY = 'NEED_REFRESH_RETRY',
  BROKEN = 'BROKEN',
}

registerEnumType(TokenStatus, { name: 'TokenStatus' });
