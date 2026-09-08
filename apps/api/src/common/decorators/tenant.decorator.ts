import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorador para obtener el tenantId en los controllers:
 *
 * @Get()
 * async list(@TenantId() tenantId: string) { ... }
 */
export const TenantId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const req = ctx.switchToHttp().getRequest<{ tenantId?: string }>();
    return req.tenantId ?? 'default';
  },
);
