import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Vehicle } from './vehicle.entity';
import { LoanStatus } from '../utils/enum';

@Entity()
export class Loan {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Vehicle, v => v.loans, { onDelete: 'CASCADE' })
  vehicle!: Vehicle;

  @Column('float')
  requestedAmount!: number;

  @Column('float', { default: 0 })
  approvedAmount!: number;

  @Column({ type: 'text' })
  applicantName!: string;

  @Column({ type: 'int', nullable: true })
  applicantAge?: number;

  @Column({ type: 'varchar', default: 'PENDING' })
  status!: LoanStatus;

  @CreateDateColumn()
  createdAt!: Date;
}
