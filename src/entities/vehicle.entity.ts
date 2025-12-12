import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from "typeorm";
import { Valuation } from "./valuation.entity";
import { Loan } from "./loan.entity";

@Entity()
export class Vehicle {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  vin!: string;

  @Column()
  make!: string;

  @Column()
  model!: string;

  @Column("int")
  year!: number;

  @Column("int")
  mileage!: number;

  @Column()
  color!: string;

  @Column("int")
  price!: number;

  @OneToMany(() => Valuation, (v) => v.vehicle)
  valuations?: Valuation[];

  @OneToMany(() => Loan, (l) => l.vehicle)
  loans?: Loan[];

  @CreateDateColumn()
  createdAt!: Date;
}
