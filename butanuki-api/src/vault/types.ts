import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { OrderCurrency } from '../entities/enums/OrderCurrency';

@InputType('VaultInput')
export class VaultInput {
  @Field(() => String)
  name: string;

  @Field(() => OrderCurrency)
  currency: OrderCurrency;
}

@InputType('UpdateVaultInput')
export class UpdateVaultInput {
  @Field(() => String)
  name: string;
}

@ObjectType()
export class VaultStatistics {
  @Field(() => Number)
  totalSpent: number;

  @Field(() => Number)
  totalReceived: number;
}
