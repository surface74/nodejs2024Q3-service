import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { DataService } from 'src/database/data.service';

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

  async addArtist(id: string) {
    try {
      await this.dataService.addFavArtist(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new UnprocessableEntityException();
      }
      throw error;
    }
  }

  async addAlbum(id: string) {
    try {
      await this.dataService.addFavAlbum(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new UnprocessableEntityException();
      }
      throw error;
    }
  }

  async addTrack(id: string) {
    try {
      await this.dataService.addFavTrack(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new UnprocessableEntityException();
      }
      throw error;
    }
  }

  async removeArtist(itemId: string) {
    const entity = await this.dataService.removeFavArtist(itemId);
    if (!entity) {
      throw new NotFoundException();
    }
  }

  async removeAlbum(itemId: string) {
    const entity = await this.dataService.removeFavAlbum(itemId);
    if (!entity) {
      throw new NotFoundException();
    }
  }

  async removeTrack(itemId: string) {
    const entity = await this.dataService.removeFavTrack(itemId);
    if (!entity) {
      throw new NotFoundException();
    }
  }

  async findAll() {
    const favorites = await this.dataService.findFavorites();

    const favs: FavoritesResponse = {
      artists: new Array<Artist>(),
      albums: new Array<Album>(),
      tracks: new Array<Track>(),
    };

    if (!favorites.length) return favs;

    const favorite = favorites[0];

    for (const id of favorite.artists) {
      favs.artists.push(await this.artistService.findOne(id));
    }
    for (const id of favorite.albums) {
      favs.albums.push(await this.albumService.findOne(id));
    }
    for (const id of favorite.tracks) {
      const entity = await this.trackService.findOne(id);
      entity.duration = +entity.duration;

      favs.tracks.push(entity);
    }

    return favs;
  }
}
