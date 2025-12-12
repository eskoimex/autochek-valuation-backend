import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthDto } from './dto/auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private svc: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: "Register a new user",
    description: "Creates a new user account in the system.",
  })
  @ApiResponse({ status: 201, description: "User registered successfully." })
  @ApiResponse({ status: 400, description: "Invalid input." })
  register(@Body() body: AuthDto) {
    return this.svc.register(body);
  }

  @Post('login')
  @ApiOperation({
    summary: "User login",
    description: "Authenticates a user and returns a JWT token.",
  })
  @ApiResponse({ status: 200, description: "User logged in successfully." })
  @ApiResponse({ status: 400, description: "Invalid credentials." })
  login(@Body() body: AuthDto) {
    return this.svc.login(body);
  }
}
