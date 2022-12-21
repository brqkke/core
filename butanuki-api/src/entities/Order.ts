import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { OrderStatus } from './enums/OrderStatus';
import { User } from './User';
import { OrderCurrency } from './enums/OrderCurrency';
import { Field, Float, ObjectType } from '@nestjs/graphql';
import { OrderTemplate } from './OrderTemplate';

@ObjectType()
export class BityPaymentDetails {
  @Field({ nullable: true })
  iban?: string;

  @Field({ nullable: true })
  swift_bic?: string;

  @Field({ nullable: true })
  recipient?: string;

  @Field({ nullable: true })
  account_number?: string;

  @Field({ nullable: true })
  bank_code?: string;

  @Field({ nullable: true })
  bank_address?: string;
}

@Unique(['remoteId'])
@Entity()
@ObjectType()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @Column()
  remoteId: string;

  @Column()
  @Field()
  transferLabel: string;

  @Column({ type: 'enum', enum: OrderStatus })
  @Field(() => OrderStatus)
  status: OrderStatus;

  @Column()
  userId: string;

  @Index()
  @JoinColumn()
  @ManyToOne(() => User, (user) => user.orders)
  user?: User;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @Column()
  lastCheckedAt: Date;

  @Column({ type: 'string', nullable: true })
  previousOrderId?: string | null;

  @ManyToOne(() => Order, (order) => order.renewedByOrders, { nullable: true })
  @JoinColumn()
  previousOrder?: Order;

  @OneToMany(() => Order, (order) => order.previousOrder)
  renewedByOrders?: Order[];

  @ManyToOne(() => OrderTemplate, { nullable: true })
  @Index()
  @JoinColumn()
  orderTemplate?: OrderTemplate | null;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  orderTemplateId?: string | null;

  @Column()
  @Field()
  amount: number;

  //filledAmount in bitcoin
  @Field(() => Float, { nullable: true })
  @Column({ type: 'decimal', nullable: true, precision: 20, scale: 8 })
  filledAmount?: number | null;

  @Column({ type: 'enum', enum: OrderCurrency })
  @Field(() => OrderCurrency)
  currency: OrderCurrency;

  @Column()
  bankDetails?: string;

  @Column()
  @Field(() => String, { nullable: true })
  redactedCryptoAddress?: string;
}
