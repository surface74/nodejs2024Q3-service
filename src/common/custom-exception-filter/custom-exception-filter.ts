import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Inject,
  OnModuleInit,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ICustomHttpError } from './interfaces/custom-http-error.interface';
import { CustomLogger } from '../custom-logger/custom-logger.service';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter, OnModuleInit {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    @Inject(CustomLogger)
    private customLogger: CustomLogger,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody: ICustomHttpError = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(request),
    };

    this.customLogger.logHttpError(responseBody);

    httpAdapter.reply(response, responseBody, httpStatus);
  }

  onModuleInit() {
    process.on('uncaughtException', (error) => {
      const message = `${error.message} ${error.stack}`;
      this.customLogger.fatal(message, 'uncaughtException');

      process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
      const message = `Unhandled rejection at: ${promise}, reason: ${reason}`;
      this.customLogger.error(message, 'unhandledRejection');
    });
  }
}
