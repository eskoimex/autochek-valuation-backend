import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AppDataSource } from '../../../ormconfig';
import { User } from '../../entities/user.entity';
import { AuthDto } from './dto/auth.dto';
import { UserRole } from '../../utils/enum';

@Injectable()
export class AuthService {
  private repo = AppDataSource.getRepository(User);
  constructor(private jwt: JwtService) {}

  async register(dto: AuthDto) {
    const exists = await this.repo.findOne({ where: { email: dto.email } });
    if (exists) throw new BadRequestException("Email exists");
    const hash = await bcrypt.hash(dto.password, 10);
    const user = this.repo.create({
      email: dto.email,
      password: hash,
      role: dto.role || UserRole.AGENT,
    });
    await this.repo.save(user);
    return { message: "registered" };
  }

  async login(dto: AuthDto) {
    const user = await this.repo.findOne({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException("Invalid credentials");
    const ok = await bcrypt.compare(dto.password, user.password);
    if (!ok) throw new UnauthorizedException("Invalid credentials");
    const token = this.jwt.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    return { access_token: token };
  }
}
