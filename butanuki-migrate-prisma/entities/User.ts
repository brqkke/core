import {
  Column,
  Entity,
  Index,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserStatus } from "./enums/UserStatus";
import { Session } from "./Session";
import { UserRole } from "./enums/UserRole";
import { Order } from "./Order";
import { Token } from "./Token";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  @Index()
  email: string;

  @Column({ nullable: true })
  @Index()
  tempCode?: string;

  @Column({ default: () => "0" })
  tempCodeExpireAt: number;

  @OneToOne(() => Token, (t) => t.user)
  token?: Token;

  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];
  //
  // orders: Order[];

  @Column({ type: "enum", default: UserStatus.ACTIVE, enum: UserStatus })
  status: UserStatus = UserStatus.ACTIVE;

  @Column({ type: "enum", default: UserRole.USER, enum: UserRole })
  role: UserRole = UserRole.USER;

  @Column()
  locale: string = "en";

  @OneToMany(() => Order, (order) => order.user)
  orders?: Order[];
}
