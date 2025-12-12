import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehiclesModule } from './modules/vehicles/vehicles.module';
import { ValuationsModule } from './modules/valuations/valuations.module';
import { LoansModule } from './modules/loans/loans.module';
import { OffersModule } from './modules/offers/offers.module';
import { AuthModule } from './modules/auth/auth.module';
import { AppDataSource } from '../ormconfig';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(AppDataSource.options),
    VehiclesModule,
    ValuationsModule,
    LoansModule,
    OffersModule,
    AuthModule,
  ],
})
export class AppModule {}
