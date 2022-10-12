import {
  Column,
  Entity,
  Index,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserStatus } from './enums/UserStatus';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Session } from './Session';
import { UserRole } from './enums/UserRole';
import { Order } from './Order';
import { Token } from './Token';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field()
  @Index()
  email: string;

  @Column({ nullable: true })
  @Index()
  tempCode?: string;

  @Column({ default: () => '0' })
  tempCodeExpireAt: number;

  @OneToOne(() => Token, (t) => t.user)
  token?: Token;

  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];
  //
  // orders: Order[];

  @Column({ type: 'enum', default: UserStatus.ACTIVE, enum: UserStatus })
  status: UserStatus = UserStatus.ACTIVE;

  @Column({ type: 'enum', default: UserRole.USER, enum: UserRole })
  role: UserRole = UserRole.USER;

  @Column()
  @Field(() => String)
  locale: string = 'en';

  @OneToMany(() => Order, (order) => order.user)
  orders?: Order[];
}
