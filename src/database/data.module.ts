import { Module } from '@nestjs/common';
import { DataService } from './data.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/api/user/entities/user.entity';
import { Album } from 'src/api/album/entities/album.entity';
import { Artist } from 'src/api/artist/entities/artist.entity';
import { Track } from 'src/api/track/entities/track.entity';
import { Favorite } from 'src/api/favorites/entities/favorite.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Album]),
    TypeOrmModule.forFeature([Artist]),
    TypeOrmModule.forFeature([Track]),
    TypeOrmModule.forFeature([Favorite]),
  ],
  providers: [DataService],
  exports: [DataService],
})
export class DataModule {}
