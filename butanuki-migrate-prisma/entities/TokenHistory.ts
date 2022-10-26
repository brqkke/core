import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TokenHistoryCause } from './enums/TokenHistoryCause';

@Entity()
@Index(['tokenId', 'createdAt'])
export class TokenHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  //no relations because we want to save fast without locking anything
  @Column()
  userId: string;

  //no relations because we want to save fast without locking anything
  @Column()
  tokenId: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ enum: TokenHistoryCause, type: 'enum' })
  creationCause: TokenHistoryCause;

  @Column()
  accessToken: string;

  @Column()
  refreshToken: string;
}
