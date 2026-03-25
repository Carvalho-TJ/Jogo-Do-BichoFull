import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { Bet } from '../../bets/entities/bet.entity';

export enum BetType {
  GRUPO = 'grupo',
  DEZENA = 'dezena',
  MILHAR = 'milhar',
}

@Entity('draws')
export class Draw {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: BetType, default: BetType.MILHAR })
  type: BetType;

  @Column({ type: 'varchar' })
  winningNumber: string;

  @Column({ type: 'text', nullable: true })
  allNumbers: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Bet, (bet) => bet.id)
  bets: Bet[];
  winningMilhar: any;
}
