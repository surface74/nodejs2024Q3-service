import { forwardRef, Module } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { ArtistModule } from 'src/api/artist/artist.module';
import { AlbumModule } from 'src/api/album/album.module';
import { TrackModule } from 'src/api/track/track.module';
import { DataModule } from 'src/database/data.module';
import { CustomLoggerModule } from 'src/common/custom-logger/custom-logger.module';

@Module({
  imports: [
    CustomLoggerModule,
    DataModule,
    forwardRef(() => ArtistModule),
    forwardRef(() => AlbumModule),
    forwardRef(() => TrackModule),
  ],
  controllers: [FavoritesController],
  providers: [FavoritesService],
  exports: [FavoritesService],
})
export class FavoritesModule {}
