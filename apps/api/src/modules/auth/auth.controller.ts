import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { TenantId } from '../../common/decorators/tenant.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @TenantId() tenantId: string,
  ) {
    return this.authService.login(dto, tenantId);
  }

  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @TenantId() tenantId: string,
  ) {
    return this.authService.register(dto, tenantId);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: Request & { user: { sub: string } }) {
    return this.authService.getProfile(req.user.sub);
  }
}
