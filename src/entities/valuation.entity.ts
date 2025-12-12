import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Vehicle } from './vehicle.entity';

@Entity()
export class Valuation {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Vehicle, v => v.valuations, { onDelete: 'CASCADE' })
  vehicle!: Vehicle;

  @Column('float')
  estimatedValue!: number;

  @Column({ nullable: true })
  source?: string;

  @CreateDateColumn()
  createdAt!: Date;
}
