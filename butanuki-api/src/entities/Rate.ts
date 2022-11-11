import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderCurrency } from './enums/OrderCurrency';

@ObjectType({ description: 'The bitcoin price in the selected currency' })
@Entity()
export class Rate {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({ type: 'enum', enum: OrderCurrency, unique: true })
  @Field(() => String)
  currency: OrderCurrency;

  @Column({ type: 'float' })
  @Field(() => Number)
  rate: number;

  @UpdateDateColumn()
  updatedAt: Date;
}
