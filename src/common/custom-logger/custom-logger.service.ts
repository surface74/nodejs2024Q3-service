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

  /**
   * Write a 'fatal' level log.
   */
  // fatal(message: any, ...optionalParams: any[]) {}

  /**
   * Write an 'error' level log.
   */
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

  /**
   * Write a 'warn' level log.
   */
  // warn(message: any, ...optionalParams: any[]) {}

  /**
   * Write a 'debug' level log.
   */
  // debug?(message: any, ...optionalParams: any[]) {}

  /**
   * Write a 'verbose' level log.
   */
  // verbose?(message: any, ...optionalParams: any[]) {}
}
