import { Injectable, NotFoundException } from '@nestjs/common';
import { AppDataSource } from '../../../ormconfig';
import { Valuation } from '../../entities/valuation.entity';
import { Vehicle } from '../../entities/vehicle.entity';
import Helper from '../../utils/helpers';

@Injectable()
export class ValuationsService {
  private valuationRepo = AppDataSource.getRepository(Valuation);
  private vehicleRepo = AppDataSource.getRepository(Vehicle);

  async getValuationByVin(vin: string) {
    const vehicle = await this.vehicleRepo.findOne({ where: { vin } });
    if (!vehicle) throw new NotFoundException('Vehicle not found');

    let estimated = await Helper.callExternalValuation(vin, vehicle);
    const val = this.valuationRepo.create({
      vehicle,
      estimatedValue: estimated,
      source: process.env.RAPIDAPI_KEY ? 'external' : 'simulated',
    });
    return this.valuationRepo.save(val);
  }

  
}
