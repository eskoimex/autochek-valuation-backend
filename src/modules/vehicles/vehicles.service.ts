import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { AppDataSource } from '../../../ormconfig';
import { Vehicle } from '../../entities/vehicle.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';

@Injectable()
export class VehiclesService {
  private repo = AppDataSource.getRepository(Vehicle);

  async create(dto: CreateVehicleDto) {
    const exists = await this.repo.findOne({ where: { vin: dto.vin } });
    if (exists) throw new BadRequestException('Vehicle with this VIN already exists');

    const v = this.repo.create(dto);
    return this.repo.save(v);
  }

  async findByVin(vin: string) {
    const v = await this.repo.findOne({ where: { vin } });
    if (!v) throw new NotFoundException('Vehicle not found');
    return v;
  }

  async findAll() {
    return this.repo.find();
  }
}
