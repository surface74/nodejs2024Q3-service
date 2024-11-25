import { forwardRef, Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { FavoritesModule } from 'src/api/favorites/favorites.module';
import { AlbumModule } from 'src/api/album/album.module';
import { TrackModule } from 'src/api/track/track.module';
import { DataModule } from 'src/database/data.module';
import { CustomLoggerModule } from 'src/common/custom-logger/custom-logger.module';

@Module({
  imports: [
    CustomLoggerModule,
    DataModule,
    forwardRef(() => AlbumModule),
    forwardRef(() => TrackModule),
    forwardRef(() => FavoritesModule),
  ],
  controllers: [ArtistController],
  providers: [ArtistService],
  exports: [ArtistService],
})
export class ArtistModule {}
