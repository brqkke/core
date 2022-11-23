import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

export enum DCAInterval {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
}

@ObjectType('EstimatorResult')
export class EstimatorResult {
  @Field(() => Float, { nullable: true })
  averageBtcPrice: number | null;

  @Field(() => Int)
  transactionCount: number;
}
