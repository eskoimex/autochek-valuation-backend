import { DataSource } from 'typeorm';
import { Vehicle } from './src/entities/vehicle.entity';
import { Valuation } from './src/entities/valuation.entity';
import { Loan } from './src/entities/loan.entity';
import { Offer } from './src/entities/offer.entity';
import { User } from './src/entities/user.entity';
import dotenv from 'dotenv';
dotenv.config();

const DB_FILE = process.env.DB_FILE || ':memory:';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: DB_FILE,
  synchronize: true,
  logging: false,
  entities: [Vehicle, Valuation, Loan, Offer, User],
});
