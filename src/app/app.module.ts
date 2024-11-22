import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from '../api/user/user.module';
import { ArtistModule } from '../api/artist/artist.module';
import { TrackModule } from '../api/track/track.module';
import { AlbumModule } from '../api/album/album.module';
import { FavoritesModule } from '../api/favorites/favorites.module';
import { ConfigModule } from '@nestjs/config';
import { DataModule } from '../database/data.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../api/user/entities/user.entity';
import { Album } from '../api/album/entities/album.entity';
import { Artist } from '../api/artist/entities/artist.entity';
import { Track } from '../api/track/entities/track.entity';
import { Favorite } from '../api/favorites/entities/favorite.entity';
import { APP_FILTER } from '@nestjs/core';
import { CustomExceptionFilter } from '../common/custom-exception-filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.local',
      isGlobal: true,
    }),
    DataModule,
    UserModule,
    ArtistModule,
    TrackModule,
    AlbumModule,
    FavoritesModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_DOMAIN || 'localhost',
      port: +(process.env.POSTGRES_PORT || '5433'),
      username: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'postgres',
      database: process.env.POSTGRES_DB || 'postgres',
      entities: [User, Album, Artist, Track, Favorite],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: CustomExceptionFilter,
    },
  ],
})
export class AppModule {}
