import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DataModule } from 'src/database/data.module';
import { CustomLoggerModule } from 'src/common/custom-logger/custom-logger.module';

@Module({
  imports: [CustomLoggerModule, DataModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
