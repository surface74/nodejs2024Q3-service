import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { DataService } from 'src/storage/data.service';
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
    private dataService: DataService,
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

    const artist = await this.dataService.findOneArtist(itemId);
    if (!artist) {
      return new DbResult({ errorText: ErrorMessage.RECORD_NOT_EXISTS });
    }

    await this.dataService.addFavArtist(itemId);

    return new DbResult({});
  }

  async addAlbum(itemId: string) {
    if (!validate(itemId)) {
      return new DbResult({ errorText: ErrorMessage.WRONG_UUID });
    }

    const album = await this.dataService.findOneAlbum(itemId);
    if (!album) {
      return new DbResult({ errorText: ErrorMessage.RECORD_NOT_EXISTS });
    }

    await this.dataService.addFavAlbum(itemId);

    return new DbResult({});
  }

  async addTrack(itemId: string) {
    if (!validate(itemId)) {
      return new DbResult({ errorText: ErrorMessage.WRONG_UUID });
    }

    const track = await this.dataService.findOneTrack(itemId);
    if (!track) {
      return new DbResult({ errorText: ErrorMessage.RECORD_NOT_EXISTS });
    }

    await this.dataService.addFavTrack(itemId);

    return new DbResult({});
  }

  async removeArtist(itemId: string) {
    if (!validate(itemId)) {
      return new DbResult({ errorText: ErrorMessage.WRONG_UUID });
    }

    if (!this.dataService.favStorage.artists.includes(itemId)) {
      return new DbResult({ errorText: ErrorMessage.RECORD_NOT_EXISTS });
    }

    await this.dataService.removeFavArtist(itemId);

    return new DbResult({});
  }

  async removeAlbum(itemId: string) {
    if (!validate(itemId)) {
      return new DbResult({ errorText: ErrorMessage.WRONG_UUID });
    }

    if (!this.dataService.favStorage.albums.includes(itemId)) {
      return new DbResult({ errorText: ErrorMessage.RECORD_NOT_EXISTS });
    }

    await this.dataService.removeFavAlbum(itemId);

    return new DbResult({});
  }

  async removeTrack(itemId: string) {
    if (!validate(itemId)) {
      return new DbResult({ errorText: ErrorMessage.WRONG_UUID });
    }

    if (!this.dataService.favStorage.tracks.includes(itemId)) {
      return new DbResult({ errorText: ErrorMessage.RECORD_NOT_EXISTS });
    }

    await this.dataService.removeFavTrack(itemId);

    return new DbResult({});
  }

  async findAll() {
    const favs: FavoritesResponse = {
      artists: new Array<Artist>(),
      albums: new Array<Album>(),
      tracks: new Array<Track>(),
    };

    (
      await Promise.all(
        this.dataService.favStorage.artists.map(
          this.artistService.findOne.bind(this),
        ),
      )
    )
      .filter((result: DbResult) => !!result.data)
      .forEach((result: DbResult) => favs.artists.push(result.data as Artist));

    (
      await Promise.all(
        this.dataService.favStorage.albums.map(
          this.albumService.findOne.bind(this),
        ),
      )
    )
      .filter((result: DbResult) => !!result.data)
      .forEach((result: DbResult) => favs.albums.push(result.data as Album));

    (
      await Promise.all(
        this.dataService.favStorage.tracks.map(
          this.trackService.findOne.bind(this),
        ),
      )
    )
      .filter((result: DbResult) => !!result.data)
      .forEach((result: DbResult) => favs.tracks.push(result.data as Track));

    return favs;
  }
}
