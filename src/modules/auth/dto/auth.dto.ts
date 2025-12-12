import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";
import { UserRole } from "../../../utils/enum";

export class AuthDto {
  @ApiProperty({ example: "samuel@example.com" })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: "StrongPassword123!" })
  @IsNotEmpty()
  password!: string;

  @ApiProperty({ example: "AGENT", required: false })
  @IsOptional()
  role?: UserRole
}
