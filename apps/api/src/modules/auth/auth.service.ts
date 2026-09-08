import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto, tenantId?: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
      include: {
        veterinarian: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas. Usuario no encontrado.');
    }

    // Verificar contraseña (bcrypt o compatibilidad con contraseñas demo sembradas)
    let isPasswordValid = false;
    if (user.password === 'hashed_password_demo' || user.password === dto.password) {
      isPasswordValid = true;
    } else {
      isPasswordValid = await bcrypt.compare(dto.password, user.password).catch(() => false);
    }

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas. Contraseña incorrecta.');
    }

    // Si el usuario no tiene tenantId pero se proveyó uno, asociarlo
    if (!user.tenantId && tenantId && tenantId !== 'default') {
      const tenant = await this.prisma.tenant.findUnique({ where: { slug: tenantId } });
      if (tenant) {
        await this.prisma.user.update({
          where: { id: user.id },
          data: { tenantId: tenant.id },
        });
      }
    }

    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      tenantId: user.tenantId || tenantId || 'default',
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId || tenantId || 'default',
        phone: user.phone,
        veterinarian: user.veterinarian,
      },
    };
  }

  async register(dto: RegisterDto, tenantSlug?: string) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existing) {
      throw new ConflictException('Ya existe una cuenta con este correo electrónico.');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    let resolvedTenantId: string | null = null;
    if (tenantSlug && tenantSlug !== 'default') {
      const tenant = await this.prisma.tenant.findUnique({ where: { slug: tenantSlug } });
      if (tenant) {
        resolvedTenantId = tenant.id;
      }
    }

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email.toLowerCase(),
        password: hashedPassword,
        phone: dto.phone,
        role: 'CLIENT',
        tenantId: resolvedTenantId,
      },
    });

    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      tenantId: tenantSlug || 'default',
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenantId: tenantSlug || 'default',
        phone: user.phone,
      },
    };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        tenantId: true,
        createdAt: true,
        pets: {
          select: {
            id: true,
            name: true,
            species: true,
            breed: true,
            birthDate: true,
          },
        },
        veterinarian: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return user;
  }
}
