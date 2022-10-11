import { User } from './User';
import { TokenStatus } from './enums/TokenStatus';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Token {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Index({ unique: true })
  @OneToOne(() => User, (user) => user.token)
  @JoinColumn()
  user: User;

  @Column()
  accessToken: string;

  @Column()
  refreshToken: string;

  @Column({ enum: TokenStatus, type: 'enum', default: TokenStatus.ACTIVE })
  status: TokenStatus = TokenStatus.ACTIVE;

  @Column({ type: 'timestamp', nullable: true })
  lastRefreshedAt?: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  lastRefreshTriedAt?: Date | null;

  @Column({ type: 'int', default: () => '0' })
  refreshTriesCount: number;
}
