import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  expireAt: number;

  token: string;

  // @OneToMany(User)
  // user: User;
  //
  // @JoinColumn()
  // userId: string;
}
