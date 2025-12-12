import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Offer {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  loanId!: string;

  @Column('float')
  apr!: number;

  @Column('int')
  termMonths!: number;

  @CreateDateColumn()
  createdAt!: Date;
}
