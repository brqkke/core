import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum EventLogType {
  BROKEN_TOKEN = 'BROKEN_TOKEN',
}

@Entity()
export class EventLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: EventLogType })
  type: EventLogType;

  @Column()
  data: string;

  @Column()
  createdAt: Date;
}
