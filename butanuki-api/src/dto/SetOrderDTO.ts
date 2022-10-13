import { Field, InputType, Int } from '@nestjs/graphql';

@InputType('OrderInput')
export class SetOrderDTO {
  @Field(() => Int)
  amount: number;

  @Field(() => String, { nullable: true })
  cryptoAddress?: string;
}
