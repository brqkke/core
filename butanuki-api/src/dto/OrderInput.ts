import { Field, InputType, Int } from '@nestjs/graphql';
import { OrderFrequency } from '../entities/enums/OrderFrequency';

@InputType('OrderInput')
export class OrderInput {
  @Field(() => Int)
  amount?: number;

  @Field(() => String, { nullable: true })
  cryptoAddress?: string;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => OrderFrequency)
  frequency: OrderFrequency;
}

@InputType('CreateOrderInput')
export class CreateOrderInput {
  @Field(() => Int)
  amount: number;

  @Field(() => String, { nullable: true })
  cryptoAddress: string;

  @Field(() => String, { nullable: true })
  name: string;

  @Field(() => OrderFrequency)
  frequency: OrderFrequency;
}
