import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserStatus } from './enums/UserStatus';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  tempCode?: string;

  @Column({ default: () => '0' })
  tempCodeExpireAt: number;
  //
  // token: Token;
  //
  // sessions: Session[];
  //
  // orders: Order[];

  @Column({ type: 'enum', default: UserStatus.ACTIVE, enum: UserStatus })
  status: UserStatus = UserStatus.ACTIVE;
  locale = 'en';
}
