
import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNumber, IsInt, IsOptional, IsEnum } from "class-validator";
import { LoanStatus } from "../../../utils/enum";

export class LoanDto {
  @IsString()
  @ApiProperty({
    description: "Vehicle Identification Number",
    example: "1HGCM82633A004352",
    type: String,
  })
  vin!: string;

  @IsNumber()
  @ApiProperty({
    description: "Amount the applicant is requesting for the loan",
    example: 25000,
    type: Number,
  })
  requestedAmount!: number;

  @IsNumber()
  @ApiProperty({
    description: "Amount approved by the loan officer",
    example: 20000,
    type: Number,
    default: 0,
  })
  approvedAmount!: number;

  @IsString()
  @ApiProperty({
    description: "Full name of the applicant",
    example: "John Doe",
    type: String,
  })
  applicantName!: string;

  @IsOptional()
  @IsInt()
  @ApiProperty({
    description: "Age of the applicant",
    example: 32,
    type: Number,
    required: false,
    nullable: true,
  })
  applicantAge?: number;

  @IsEnum(LoanStatus)
  @ApiProperty({
    description: "Current loan status",
    example: "PENDING",
    enum: LoanStatus,
    default: "PENDING",
  })
  status!: LoanStatus;
}

export class LoanStatusDto {
  @IsEnum(LoanStatus)
  @ApiProperty({
    description: "Current loan status",
    example: "PENDING",
    enum: LoanStatus,
    default: "PENDING",
  })
  status!: LoanStatus;
}

