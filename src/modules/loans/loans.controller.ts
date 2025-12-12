import { Controller, Post, Body, Patch, Param, Get, UseGuards } from '@nestjs/common';
import { LoansService } from './loans.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserRole } from '../../utils/enum';
import { LoanDto, LoanStatusDto } from './dto/loan.dto';

@ApiTags("Loans")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("loans")
export class LoansController {
  constructor(private readonly svc: LoansService) {}

  @Roles(UserRole.AGENT, UserRole.ADMIN)
  @Post()
  @ApiBearerAuth()
  @ApiTags("Loans")
  @ApiOperation({
    summary: "Submit a new loan application",
    description: "Creates a new loan application in the system.",
  })
  @ApiResponse({
    status: 201,
    description: "Loan application submitted successfully.",
  })
  @ApiResponse({ status: 400, description: "Invalid input." })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({ status: 403, description: "Forbidden. Insufficient role." })
  async submit(@Body() dto: LoanDto) {
    return this.svc.submit(dto);
  }

  @Roles(UserRole.ADMIN)
  @Patch(":id/status")
  @ApiBearerAuth()
  @ApiTags("Loans")
  @ApiOperation({
    summary: "Update loan application status",
    description: "Allows an admin to update the status of a loan application.",
  })
  @ApiResponse({
    status: 200,
    description: "Loan status updated successfully.",
  })
  @ApiResponse({ status: 400, description: "Invalid status or input." })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({ status: 403, description: "Forbidden. Insufficient role." })
  @ApiResponse({ status: 404, description: "Loan application not found." })
  async updateStatus(@Param("id") id: string, @Body() body: LoanStatusDto) {
    return this.svc.updateStatus(id, body);
  }

  @Roles(UserRole.ADMIN, UserRole.LENDER)
  @Get()
  @ApiBearerAuth()
  @ApiTags("Loans")
  @ApiOperation({
    summary: "List all loan applications",
    description:
      "Retrieves a list of all loan applications. Accessible by admins and lenders.",
  })
  @ApiResponse({
    status: 200,
    description: "List of loan applications retrieved successfully.",
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({ status: 403, description: "Forbidden. Insufficient role." })
  async list() {
    return this.svc.findAll();
  }

  @Roles(UserRole.ADMIN, UserRole.LENDER)
  @Get(":id")
  @ApiBearerAuth()
  @ApiTags("Loans")
  @ApiOperation({
    summary: "Get loan application by ID",
    description:
      "Retrieves the details of a specific loan application by its ID. Accessible by admins and lenders.",
  })
  @ApiResponse({
    status: 200,
    description: "Loan application retrieved successfully.",
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({ status: 403, description: "Forbidden. Insufficient role." })
  @ApiResponse({ status: 404, description: "Loan application not found." })
  async get(@Param("id") id: string) {
    return this.svc.findById(id);
  }
}
