import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import db from 'src/storage/data.service';
import { v4 as uuidv4, validate } from 'uuid';
import { ErrorMessage } from 'src/storage/types/error-message.enum';
import { DbResult } from 'src/storage/types/result.types';

import { FavoritesResponse } from './types/favorites-response.interface';
import { Album } from 'src/album/entities/album.entity';
import { Track } from 'src/track/entities/track.entity';
import { Artist } from 'src/artist/entities/artist.entity';
import { ArtistService } from 'src/artist/artist.service';
import { AlbumService } from 'src/album/album.service';
import { TrackService } from 'src/track/track.service';

@Injectable()
export class FavoritesService {
  constructor(
    @Inject(forwardRef(() => ArtistService))
    @Inject(forwardRef(() => AlbumService))
    @Inject(forwardRef(() => TrackService))
    private artistService: ArtistService,
    private albumService: AlbumService,
    private trackService: TrackService,
  ) {}

  async addTrack(itemId: string) {
    if (!validate(itemId)) {
      return new DbResult({ errorText: ErrorMessage.WRONG_UUID });
    }

    const itemIndex = await db.trackStorage.findIndex(
      (track: Track) => track.id === itemId,
    );

    if (itemIndex == -1) {
      return new DbResult({
        errorText: ErrorMessage.RECORD_NOT_EXISTS,
      });
    }

    const favIndex = await db.favStorage.tracks.findIndex(
      (id: string) => id === itemId,
    );
    if (favIndex < 0) {
      await db.favStorage.tracks.push(itemId);
    }

    return new DbResult({});
  }

  async removeTrack(itemId: string) {
    if (!validate(itemId)) {
      return new DbResult({ errorText: ErrorMessage.WRONG_UUID });
    }

    const favIndex = await db.favStorage.tracks.findIndex(
      (id: string) => id === itemId,
    );

    if (favIndex == -1) {
      return new DbResult({
        errorText: ErrorMessage.RECORD_NOT_EXISTS,
      });
    }

    await db.favStorage.tracks.splice(favIndex, 1);

    return new DbResult({});
  }

  async findAll() {
    const favs: FavoritesResponse = {
      artists: new Array<Artist>(),
      albums: new Array<Album>(),
      tracks: new Array<Track>(),
    };

    for (const id of db.favStorage.artists) {
      const result = await this.artistService.findOne(id);
      if (!result.errorText) {
        favs.artists.push(result.data as Artist);
      }
    }

    for (const id of db.favStorage.albums) {
      const result = await this.albumService.findOne(id);
      if (!result.errorText) {
        favs.albums.push(result.data as Album);
      }
    }

    for (const id of db.favStorage.tracks) {
      const result = await this.trackService.findOne(id);
      if (!result.errorText) {
        favs.tracks.push(result.data as Track);
      }
    }

    return favs;
  }

  async findOne(id: number) {
    return `This action returns a #${id} favorite`;
  }

  async update(id: number, updateFavoriteDto: UpdateFavoriteDto) {
    return `This action updates a #${id} favorite`;
  }

  async remove(id: number) {
    return `This action removes a #${id} favorite`;
  }
}
