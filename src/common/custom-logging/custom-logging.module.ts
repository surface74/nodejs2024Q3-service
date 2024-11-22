import { Module } from '@nestjs/common';
import { CustomLogging } from './custom-logging.service';

@Module({
  providers: [CustomLogging],
  exports: [CustomLogging],
})
export class CustomLoggingModule {}
