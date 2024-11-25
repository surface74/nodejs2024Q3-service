import { Module } from '@nestjs/common';
import { CustomExceptionFilter } from './custom-exception-filter';
import { CustomLoggerModule } from '../custom-logger/custom-logger.module';

@Module({
  imports: [CustomLoggerModule],
  providers: [CustomExceptionFilter],
  exports: [CustomExceptionFilter],
})
export class CustomExceptionFilterModule {}
