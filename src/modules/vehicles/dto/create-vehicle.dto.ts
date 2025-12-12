import { IsString, IsNotEmpty, IsInt, MinLength, MaxLength } from 'class-validator';

export class CreateVehicleDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(11)
  @MaxLength(17)
  vin!: string;

  @IsString()
  make!: string;

  @IsString()
  model!: string;

  @IsInt()
  year!: number;

  @IsInt()
  mileage!: number;

  @IsString()
  color!: string;

  @IsInt()
  price!: number;
}
