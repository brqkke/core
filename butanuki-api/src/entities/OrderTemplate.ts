import {
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Vault } from './Vault';
import { OrderCurrency } from './enums/OrderCurrency';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Order } from './Order';
import { OrderFrequency } from './enums/OrderFrequency';

@Entity()
@ObjectType()
export class OrderTemplate {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field()
  name: string;

  @ManyToOne(() => Vault)
  @Index()
  @JoinColumn()
  vault: Vault;

  @Column()
  @Field(() => ID)
  vaultId: string;

  @OneToMany(() => Order, (order) => order.orderTemplate)
  orders: Order[];

  @Column()
  @Field()
  amount: number;

  @Column()
  currency: OrderCurrency;

  @DeleteDateColumn()
  deletedAt?: Date;

  @Column()
  createdAt: Date;

  @Column({ type: 'enum', enum: OrderFrequency })
  @Field(() => OrderFrequency)
  frequency: OrderFrequency;
}
