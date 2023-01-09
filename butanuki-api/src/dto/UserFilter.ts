import { Field, InputType } from '@nestjs/graphql';

@InputType('UserFilterInput')
export class UserFilterInput {
  @Field(() => Boolean, { nullable: true })
  hasOrders?: boolean;

  @Field(() => Boolean, { nullable: true })
  hasActiveBityToken?: boolean;
}
