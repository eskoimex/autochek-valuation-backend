import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { ValuationsService } from './valuations.service';
import { RequestValuationDto } from './dto/request-valuation.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { UserRole } from '../../utils/enum';

@ApiTags('Valuations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('valuations')
export class ValuationsController {
  constructor(private readonly svc: ValuationsService) {}

  @Roles(UserRole.AGENT, UserRole.ADMIN)
  @Post()
  @ApiBearerAuth()
  @ApiTags('Valuations')
  @ApiOperation({ summary: 'Request a valuation by VIN', description: 'Allows AGENT and ADMIN users to request a valuation for a vehicle by VIN.' })
  @ApiBody({ type: RequestValuationDto, description: 'VIN and other details for valuation request' })
  @ApiResponse({ status: 201, description: 'Valuation requested successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async request(@Body() dto: RequestValuationDto) {
    return this.svc.getValuationByVin(dto.vin);
  }

  @Roles(UserRole.AGENT, UserRole.ADMIN, UserRole.LENDER)
  @Get(':vin')
  @ApiBearerAuth()
  @ApiTags('Valuations')
  @ApiOperation({ summary: 'Get valuation by VIN', description: 'Allows AGENT, ADMIN, and LENDER users to retrieve a valuation by VIN.' })
  @ApiResponse({ status: 200, description: 'Valuation retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Valuation not found.' })
  async get(@Param('vin') vin: string) {
    return this.svc.getValuationByVin(vin);
  }
}
