import { Module } from '@nestjs/common';
import { DataService } from './data.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Album } from 'src/album/entities/album.entity';
import { Artist } from 'src/artist/entities/artist.entity';
import { Track } from 'src/track/entities/track.entity';
import { Favorite } from 'src/favorites/entities/favorite.entity';

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
