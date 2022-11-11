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
import { OrderCurrency } from './enums/OrderCurrency';
import { Field, ObjectType } from '@nestjs/graphql';
import { User } from './User';
import { OrderTemplate } from './OrderTemplate';

@Entity()
@ObjectType()
export class Vault {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field(() => OrderCurrency)
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

  @OneToMany(() => OrderTemplate, (orderTemplate) => orderTemplate.vault)
  orderTemplates?: OrderTemplate[];
}
