import { Field, InputType, Int } from '@nestjs/graphql';

@InputType('OrderInput')
export class OrderInput {
  @Field(() => Int)
  amount?: number;

  @Field(() => String, { nullable: true })
  cryptoAddress?: string;

  @Field(() => String, { nullable: true })
  name?: string;
}

@InputType('CreateOrderInput')
export class CreateOrderInput {
  @Field(() => Int)
  amount: number;

  @Field(() => String, { nullable: true })
  cryptoAddress: string;

  @Field(() => String, { nullable: true })
  name: string;
}
