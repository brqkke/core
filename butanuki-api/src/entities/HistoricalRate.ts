import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { OrderCurrency } from './enums/OrderCurrency';

@Entity()
@Index(['currency', 'timestamp'], { unique: true })
export class HistoricalRate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: OrderCurrency })
  currency: OrderCurrency;

  @Column('timestamp')
  timestamp: Date;

  @Column('double precision')
  rate: number;
}
