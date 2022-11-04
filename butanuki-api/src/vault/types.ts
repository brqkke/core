import { Field, InputType } from '@nestjs/graphql';
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
