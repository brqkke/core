import { registerEnumType } from '@nestjs/graphql';

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  TO_DISABLE = 'TO_DISABLE',
  DISABLED = 'DISABLED',
}

registerEnumType(UserStatus, { name: 'UserStatus' });
