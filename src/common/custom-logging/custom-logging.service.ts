import { Injectable, ConsoleLogger } from '@nestjs/common';
import { LoggingLevel } from './types/logging-level.enum';
import { Request } from 'express';
import { Register } from './register';

@Injectable()
export class CustomLogging extends ConsoleLogger {
  private register = new Register(process.env.LOG_PATH, +process.env.LOG_SIZE);

  log(message: any, ...optionalParams: any[]) {
    super.log(message, optionalParams.join(' '));

    if (LoggingLevel.log <= +process.env.LOG_LEVEL) {
      this.register.toFile([].concat(message, ...optionalParams).join(' '));
    }
  }

  logRequest(req: Request) {
    const { method, url, query, body } = req;
    this.log('REQUEST', [
      method,
      url,
      Object.entries(query)
        .map((item) => item.join('='))
        .join('&'),
      JSON.stringify(body),
    ]);
  }

  /**
   * Write a 'fatal' level log.
   */
  // fatal(message: any, ...optionalParams: any[]) {}

  /**
   * Write an 'error' level log.
   */
  // error(message: any, ...optionalParams: any[]) {}

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
