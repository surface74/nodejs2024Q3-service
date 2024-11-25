import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from 'src/api/user/user.module';
import { ArtistModule } from 'src/api/artist/artist.module';
import { TrackModule } from 'src/api/track/track.module';
import { AlbumModule } from 'src/api/album/album.module';
import { FavoritesModule } from 'src/api/favorites/favorites.module';
import { ConfigModule } from '@nestjs/config';
import { DataModule } from 'src/database/data.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/api/user/entities/user.entity';
import { Album } from 'src/api/album/entities/album.entity';
import { Artist } from 'src/api/artist/entities/artist.entity';
import { Track } from 'src/api/track/entities/track.entity';
import { Favorite } from 'src/api/favorites/entities/favorite.entity';
import { APP_FILTER } from '@nestjs/core';
import { CustomExceptionFilter } from 'src/common/custom-exception-filter/custom-exception-filter';
import { CustomLoggerModule } from 'src/common/custom-logger/custom-logger.module';
import { AuthModule } from 'src/api/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.local',
      isGlobal: true,
    }),
    CustomLoggerModule,
    DataModule,
    UserModule,
    ArtistModule,
    TrackModule,
    AlbumModule,
    FavoritesModule,
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_DOMAIN || 'localhost',
      port: +(process.env.POSTGRES_PORT || '5433'),
      username: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'postgres',
      database: process.env.POSTGRES_DB || 'postgres',
      entities: [User, Album, Artist, Track, Favorite, AuthModule],
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
