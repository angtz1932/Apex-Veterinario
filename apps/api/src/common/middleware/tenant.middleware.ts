import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware que extrae el tenant desde el header x-tenant-id
 * y lo inyecta en request.tenantId para que los controllers lo consuman.
 */
@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request & { tenantId?: string }, res: Response, next: NextFunction) {
    const tenantId = req.headers['x-tenant-id'] as string | undefined;

    if (!tenantId) {
      // En desarrollo permitimos continuar sin tenant (para testing directo)
      if (process.env.NODE_ENV === 'production') {
        throw new BadRequestException('Header x-tenant-id es requerido');
      }
      req.tenantId = process.env.DEFAULT_TENANT_ID ?? 'default';
    } else {
      req.tenantId = tenantId;
    }

    next();
  }
}
