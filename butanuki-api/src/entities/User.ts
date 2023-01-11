import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserStatus } from './enums/UserStatus';
import {
  Field,
  ID,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { Session } from './Session';
import { UserRole } from './enums/UserRole';
import { Order } from './Order';
import { Token } from './Token';
import { Vault } from './Vault';
import { SortedInput } from '../dto/Sort';

@Entity()
@ObjectType()
@Check(`"mfaEnabled" = false OR "mfaSecret" IS NOT NULL`)
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
  @Field(() => UserRole)
  role: UserRole = UserRole.USER;

  @Column()
  @Field(() => String)
  locale: string = 'fr';

  @OneToMany(() => Order, (order) => order.user)
  orders?: Order[];

  @OneToMany(() => Vault, (vault) => vault.user)
  vaults?: Vault[];

  @Column({ nullable: true, type: 'real' })
  customPartnerFee?: number;

  @Column({ nullable: true, type: 'varchar' })
  mfaSecret?: string | null; // base32 encoded secret

  @Column()
  @Field(() => Boolean)
  mfaEnabled: boolean = false;

  @CreateDateColumn()
  @Index()
  @Field(() => Date)
  createdAt: Date = new Date();
}

export type UserWithToken = User & { token: Token };

export enum UserSortFields {
  EMAIL = 'EMAIL',
  BITY_STATUS = 'BITY_STATUS',
  CREATED_AT = 'CREATED_AT',
  HAS_OPEN_ORDERS = 'HAS_OPEN_ORDERS',
  ROLE = 'ROLE',
}
registerEnumType(UserSortFields, {
  name: 'UserSortFields',
});

@InputType('UserSortInput')
export class UserSortInput extends SortedInput(UserSortFields) {}
