import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { AppDataSource } from '../../../ormconfig';
import { Loan } from '../../entities/loan.entity';
import { Vehicle } from '../../entities/vehicle.entity';
import { Valuation } from '../../entities/valuation.entity';
import { LoanDto, LoanStatusDto } from './dto/loan.dto';
import { LoanStatus } from '../../utils/enum';

const MAX_LTV = Number(process.env.MAX_LTV || 0.8);
const MIN_VAL = Number(process.env.MIN_VALUATION || 1000);

@Injectable()
export class LoansService {
  private loanRepo = AppDataSource.getRepository(Loan);
  private vehicleRepo = AppDataSource.getRepository(Vehicle);
  private valRepo = AppDataSource.getRepository(Valuation);

  async submit(dto: LoanDto) {
    const vehicle = await this.vehicleRepo.findOne({ where: { vin: dto.vin } });
    if (!vehicle) throw new NotFoundException("Vehicle not found");

    const latestVal = await this.valRepo.findOne({
      where: { vehicle: { id: vehicle.id } },
      order: { createdAt: "DESC" },
    });
    if (!latestVal)
      throw new BadRequestException("No valuation for this vehicle");

    if (latestVal.estimatedValue < MIN_VAL)
      throw new BadRequestException("Valuation too low");

    const maxAllowed = latestVal.estimatedValue * MAX_LTV;
    if (dto.requestedAmount > maxAllowed)
      throw new BadRequestException("Requested exceeds LTV");

    const loan = this.loanRepo.create({
      vehicle,
      requestedAmount: dto.requestedAmount,
      approvedAmount: dto.requestedAmount,
      applicantName: dto.applicantName,
      applicantAge: dto.applicantAge,
      status: LoanStatus.PENDING,
    });

    return this.loanRepo.save(loan);
  }

  async updateStatus(id: string, dto: LoanStatusDto) {
    const loan = await this.loanRepo.findOne({ where: { id } });
    if (!loan) throw new NotFoundException("Loan not found");
    loan.status = dto.status;
    return this.loanRepo.save(loan);
  }

  async findAll() {
    return this.loanRepo.find({ relations: ["vehicle"] });
  }

  async findById(id: string) {
    const l = await this.loanRepo.findOne({
      where: { id },
      relations: ["vehicle"],
    });
    if (!l) throw new NotFoundException("Loan not found");
    return l;
  }
}
