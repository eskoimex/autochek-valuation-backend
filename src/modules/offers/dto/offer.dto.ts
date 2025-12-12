import { ApiProperty } from "@nestjs/swagger";
import { IsUUID, IsNumber, IsInt } from "class-validator";

export class OfferDto {
  @IsUUID()
  @ApiProperty({
    description: "Loan ID that this offer applies to",
    example: "92f5c6c3-2a33-4a3b-b61d-3ad1f453f850",
  })
  loanId!: string;

  @IsNumber()
  @ApiProperty({
    description: "Annual Percentage Rate (APR) for this offer",
    example: 7.5,
  })
  apr!: number;

  @IsInt()
  @ApiProperty({
    description: "Loan term in months",
    example: 36,
  })
  termMonths!: number;
}
