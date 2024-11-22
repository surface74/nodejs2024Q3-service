import { Injectable, ConsoleLogger } from '@nestjs/common';
import { LoggingLevel } from './logging-level.enum';

@Injectable()
export class CustomLogging extends ConsoleLogger {
  // error(message: any, stack?: string, context?: string) {
  //   // add your tailored logic here
  //   super.error(...arguments);
  // }
  /**
   * Write a 'log' level log.
   */
  log(message: any, ...optionalParams: any[]) {
    super.log(message);

    if (LoggingLevel.log <= +process.env.LOG_LEVEL) {
      console.log(
        'optionalParams: ',
        Object.values(LoggingLevel).filter((item) => typeof item === 'string'),
      );
      // console.log('optionalParams: ', LoggingLevel[LoggingLevel['log']]);
    }
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

  customLog() {
    this.log('Please feed the cat!');
  }
}
