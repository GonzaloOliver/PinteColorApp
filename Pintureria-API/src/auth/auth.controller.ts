import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ReqUser } from 'src/shared/decorators/user.decorator';
import { AuthService } from './auth.service';
import { LoginDto } from './dto';
import { AccessTokenDto } from './dto/access-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto): Promise<AccessTokenDto> {
    return this.authService.login(loginDto);
  }

  @UseGuards(AuthGuard())
  @Post('refreshToken')
  async refreshToken(@ReqUser() user) {
    return this.authService.refreshToken(user);
  }
}
