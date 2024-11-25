import { Injectable, ConsoleLogger } from '@nestjs/common';
import { LoggingLevel } from './types/logging-level.enum';
import { Request, Response } from 'express';
import { Register } from '../register/register';
import { ICustomHttpError } from '../custom-exception-filter/interfaces/custom-http-error.interface';

@Injectable()
export class CustomLogger extends ConsoleLogger {
  private register = new Register();

  log(message: any, ...optionalParams: any[]) {
    super.log(message, optionalParams.join(' '));

    if (LoggingLevel.log <= +process.env.LOG_LEVEL) {
      this.register.toLogFile([...optionalParams, message].join(' '));
    }
  }

  logRequest(req: Request) {
    const { method, url, query, body } = req;
    const message = [
      method,
      url,
      Object.entries(query)
        .map((item) => item.join('='))
        .join('&'),
      JSON.stringify(body),
    ].join(' ');

    this.log(message, this.context);
  }

  logResponse(res: Response) {
    this.log(res.statusCode, this.context);
  }

  fatal(message: any, ...optionalParams: any[]) {
    super.fatal(message, optionalParams);

    if (LoggingLevel.fatal <= +process.env.LOG_LEVEL) {
      this.register.toLogFile([...optionalParams, message].join(' '));
      this.register.toLogErrorFile([...optionalParams, message].join(' '));
    }
  }

  error(message: any, ...optionalParams: any[]) {
    super.error(message, optionalParams);

    if (LoggingLevel.error <= +process.env.LOG_LEVEL) {
      this.register.toLogFile([...optionalParams, message].join(' '));
      this.register.toLogErrorFile([...optionalParams, message].join(' '));
    }
  }

  logHttpError(httpError: ICustomHttpError) {
    this.error(JSON.stringify(httpError), this.context);
  }

  warn(message: any, ...optionalParams: any[]) {
    super.error(message, optionalParams);

    if (LoggingLevel.warn <= +process.env.LOG_LEVEL) {
      this.register.toLogFile([...optionalParams, message].join(' '));
    }
  }

  debug(message: any, ...optionalParams: any[]) {
    super.debug(message, optionalParams);

    if (LoggingLevel.debug <= +process.env.LOG_LEVEL) {
      this.register.toLogFile([...optionalParams, message].join(' '));
    }
  }

  verbose(message: any, ...optionalParams: any[]) {
    super.verbose(message, optionalParams);

    if (LoggingLevel.verbose <= +process.env.LOG_LEVEL) {
      this.register.toLogFile([...optionalParams, message].join(' '));
    }
  }
}
