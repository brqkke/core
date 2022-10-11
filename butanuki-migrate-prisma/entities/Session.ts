import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';

@Entity()
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  expireAt: number;

  @Column()
  @Index()
  token: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.sessions)
  @Index()
  @JoinColumn()
  user: User;
}
