import {
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderCurrency } from './enums/OrderCurrency';
import { Field, ObjectType } from '@nestjs/graphql';
import { User } from './User';

@Entity()
@ObjectType()
export class Vault {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column({ type: 'enum', enum: OrderCurrency })
  currency: OrderCurrency;

  @Field()
  @Column()
  createdAt: Date;

  @ManyToOne(() => User)
  @Index()
  @JoinColumn()
  user: User;

  @Field()
  @Column()
  userId: string;

  @DeleteDateColumn()
  deletedAt?: null | Date;
}
