import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RequestValuationDto {
  @IsString()
  @ApiProperty({
    description: 'Vehicle Identification Number',
    example: '1HGCM82633A004352',
    type: String,
  })
  vin!: string;
}
