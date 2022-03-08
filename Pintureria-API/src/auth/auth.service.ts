import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { LoginDto } from './dto';
import { IJwtPayload } from './jwt-payload.interface';
import { AuthRepository } from './auth.repository';
import { ConfigService } from '@nestjs/config';
import { AccessTokenDto } from './dto/access-token.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto): Promise<AccessTokenDto> {
    const { username: username, password } = loginDto;
    const user = await this.authRepository.findOneByUsername(username);

    if (!user)
      throw new UnauthorizedException(
        'El usuario o la contraseña son incorrectos',
      );

    const isMatchPassword = await compare(password, user.password);

    if (!isMatchPassword)
      throw new UnauthorizedException(
        'El usuario o la contraseña son incorrectos',
      );

    return this.signPayload(user);
  }

  async signPayload(user: User): Promise<AccessTokenDto> {
    const payload: IJwtPayload = {
      id: user.id,
      roles: user.roles,
    };

    const token = await this.jwtService.sign(payload);
    return {
      accessToken: token,
      userInfo: {
        fullname: user.getFullname(),
      },
    };
  }

  async refreshToken(payload: IJwtPayload) {
    const { iat, exp, ...payloadData } = payload;

    const newToken = await this.jwtService.sign(payloadData);

    return { newToken };
  }
}
