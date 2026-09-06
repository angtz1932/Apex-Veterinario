import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalErrorHandler implements ExceptionFilter {
  private readonly logger = new Logger(GlobalErrorHandler.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | object = 'Ha ocurrido un error interno en el servidor.';
    let errorType = 'InternalServerError';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'object' && res !== null) {
        message = (res as any).message || (res as any).error || JSON.stringify(res);
      } else {
        message = res;
      }
      errorType = exception.name;
    } else if (exception instanceof Error) {
      this.logger.error(`Error no controlado: ${exception.message}`, exception.stack);
      // No exponer detalles de excepciones de bajo nivel en producción
      message = exception.message || 'Error en la operación solicitada.';
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      errorType,
      message,
    });
  }
}
