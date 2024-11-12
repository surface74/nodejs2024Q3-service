import { forwardRef, Inject, Injectable } from '@nestjs/common';
import db from 'src/storage/data.service';
import { validate } from 'uuid';
import { ErrorMessage } from 'src/storage/types/error-message.enum';
import { DbResult } from 'src/storage/types/result.types';

import { FavoritesResponse } from './entities/favorites-response.entity';
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

  async addArtist(itemId: string) {
    if (!validate(itemId)) {
      return new DbResult({ errorText: ErrorMessage.WRONG_UUID });
    }

    const itemIndex = await db.artistStorage.findIndex(
      (item: Artist) => item.id === itemId,
    );

    if (itemIndex < 0) {
      return new DbResult({
        errorText: ErrorMessage.RECORD_NOT_EXISTS,
      });
    }

    const favIndex = await db.favStorage.artists.findIndex(
      (id: string) => id === itemId,
    );
    if (favIndex < 0) {
      await db.favStorage.artists.push(itemId);
    }

    return new DbResult({});
  }

  async addAlbum(itemId: string) {
    if (!validate(itemId)) {
      return new DbResult({ errorText: ErrorMessage.WRONG_UUID });
    }

    const itemIndex = await db.albumStorage.findIndex(
      (item: Album) => item.id === itemId,
    );

    if (itemIndex < 0) {
      return new DbResult({
        errorText: ErrorMessage.RECORD_NOT_EXISTS,
      });
    }

    const favIndex = await db.favStorage.albums.findIndex(
      (id: string) => id === itemId,
    );
    if (favIndex < 0) {
      await db.favStorage.albums.push(itemId);
    }

    return new DbResult({});
  }

  async addTrack(itemId: string) {
    if (!validate(itemId)) {
      return new DbResult({ errorText: ErrorMessage.WRONG_UUID });
    }

    const itemIndex = await db.trackStorage.findIndex(
      (item: Track) => item.id === itemId,
    );

    if (itemIndex < 0) {
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

  async removeArtist(itemId: string) {
    if (!validate(itemId)) {
      return new DbResult({ errorText: ErrorMessage.WRONG_UUID });
    }

    const favIndex = await db.favStorage.artists.findIndex(
      (id: string) => id === itemId,
    );

    if (favIndex < 0) {
      return new DbResult({
        errorText: ErrorMessage.RECORD_NOT_EXISTS,
      });
    }

    await db.favStorage.artists.splice(favIndex, 1);

    return new DbResult({});
  }

  async removeAlbum(itemId: string) {
    if (!validate(itemId)) {
      return new DbResult({ errorText: ErrorMessage.WRONG_UUID });
    }

    const favIndex = await db.favStorage.albums.findIndex(
      (id: string) => id === itemId,
    );

    if (favIndex < 0) {
      return new DbResult({
        errorText: ErrorMessage.RECORD_NOT_EXISTS,
      });
    }

    await db.favStorage.albums.splice(favIndex, 1);

    return new DbResult({});
  }

  async removeTrack(itemId: string) {
    if (!validate(itemId)) {
      return new DbResult({ errorText: ErrorMessage.WRONG_UUID });
    }

    const favIndex = await db.favStorage.tracks.findIndex(
      (id: string) => id === itemId,
    );

    if (favIndex < 0) {
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

    (await Promise.all(db.favStorage.artists.map(this.artistService.findOne)))
      .filter((result: DbResult) => !!result.data)
      .forEach((result: DbResult) => favs.artists.push(result.data as Artist));

    (await Promise.all(db.favStorage.albums.map(this.albumService.findOne)))
      .filter((result: DbResult) => !!result.data)
      .forEach((result: DbResult) => favs.albums.push(result.data as Album));

    (await Promise.all(db.favStorage.tracks.map(this.trackService.findOne)))
      .filter((result: DbResult) => !!result.data)
      .forEach((result: DbResult) => favs.tracks.push(result.data as Track));

    return favs;
  }
}
