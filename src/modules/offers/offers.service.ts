import { Injectable } from '@nestjs/common';
import { AppDataSource } from '../../../ormconfig';
import { Offer } from '../../entities/offer.entity';
import { Loan } from '../../entities/loan.entity';
import { OfferDto } from './dto/offer.dto';

@Injectable()
export class OffersService {
  private offerRepo = AppDataSource.getRepository(Offer);
  private loanRepo = AppDataSource.getRepository(Loan);

  async create(dto: OfferDto) {
    const loan = await this.loanRepo.findOne({ where: { id: dto.loanId } });
    if (!loan) throw new Error('Loan not found');

    const offer = this.offerRepo.create(dto);
    return this.offerRepo.save(offer);
  }

  async list() {
    return this.offerRepo.find({ order: { createdAt: 'DESC' } });
  }

  async forLoan(loanId: string) {
    return this.offerRepo.find({ where: { loanId }, order: { createdAt: 'DESC' } });
  }
}
