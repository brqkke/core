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

@Unique(['remoteId'])
@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  remoteId: string;

  @Column()
  transferLabel: string;

  @Column({ type: 'enum', enum: OrderStatus })
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

  @Column({ nullable: true })
  previousOrderId: string;

  @ManyToOne(() => Order, (order) => order.renewedByOrders, { nullable: true })
  @JoinColumn()
  previousOrder?: Order;

  @OneToMany(() => Order, (order) => order.previousOrder)
  renewedByOrders: Order[];

  @Column()
  amount: number;

  @Column({ type: 'enum', enum: OrderCurrency })
  currency: OrderCurrency;

  @Column()
  bankDetails?: string;

  @Column()
  redactedCryptoAddress?: string;
}
