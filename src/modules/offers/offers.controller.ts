import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { OffersService } from './offers.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UserRole } from '../../utils/enum';
import { OfferDto } from './dto/offer.dto';

@ApiTags('Offers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('offers')
export class OffersController {
  constructor(private readonly svc: OffersService) {}

  @Roles(UserRole.LENDER, UserRole.ADMIN)
  @Post()
  @ApiTags('Create Offer')
  @ApiOperation({
    summary: "Create a new offer",
    description: "Allows lenders and admins to create a new offer.",
  })
  @ApiBearerAuth()
  create(@Body() dto: OfferDto) {
    return this.svc.create(dto);
  }

  @Roles(UserRole.LENDER, UserRole.ADMIN)
  @Get()
  @ApiTags('List Offers')
  @ApiOperation({
    summary: "List all offers",
    description: "Retrieves a list of all offers. Accessible by lenders and admins.",
  })
  @ApiBearerAuth()
  list() {
    return this.svc.list();
  }

  @Roles(UserRole.LENDER, UserRole.ADMIN)
  @Get('loan/:loanId')
  @ApiTags('Offers for Loan')
  @ApiOperation({
    summary: "Get offers for a specific loan",
    description: "Retrieves all offers associated with a specific loan ID. Accessible by lenders and admins.",
  })
  @ApiBearerAuth()
  forLoan(@Param('loanId') loanId: string) {
    return this.svc.forLoan(loanId);
  }
}
