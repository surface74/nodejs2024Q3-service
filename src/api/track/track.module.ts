import { forwardRef, Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackController } from './track.controller';
import { FavoritesModule } from 'src/api/favorites/favorites.module';
import { DataModule } from 'src/database/data.module';
import { CustomLoggerModule } from 'src/common/custom-logger/custom-logger.module';

@Module({
  imports: [CustomLoggerModule, DataModule, forwardRef(() => FavoritesModule)],
  controllers: [TrackController],
  providers: [TrackService],
  exports: [TrackService],
})
export class TrackModule {}
