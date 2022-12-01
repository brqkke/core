import {
  Field,
  Float,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';

export enum DCAInterval {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
}

export enum ItemType {
  CIGARETTES = 'CIGARETTES',
  COFFEE = 'COFFEE',
  BEER = 'BEER',
  FASTFOOD = 'FASTFOOD',
  OTHER = 'OTHER',
}

registerEnumType(ItemType, {
  name: 'ItemType',
});

@ObjectType('EstimatorResult')
export class EstimatorResult {
  @Field(() => Float, { nullable: true })
  averageBtcPrice: number | null;

  @Field(() => Int)
  transactionCount: number;
}

@ObjectType('DCAConfig')
export class DCAConfig {
  @Field(() => String)
  slug: string;

  @Field(() => ItemType)
  type: string;

  @Field(() => String)
  emojis: string;

  @Field(() => DCAInterval)
  interval: DCAInterval;

  @Field(() => Float)
  price: number;
}
