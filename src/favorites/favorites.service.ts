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

  async addArtist(itemId: string) {
    const artist = await this.dataService.findOneArtist(itemId);
    if (!artist) {
      throw new UnprocessableEntityException();
    }

    await this.dataService.addFavArtist(itemId);
  }

  async addAlbum(itemId: string) {
    const album = await this.dataService.findOneAlbum(itemId);
    if (!album) {
      throw new UnprocessableEntityException();
    }

    await this.dataService.addFavAlbum(itemId);
  }

  async addTrack(itemId: string) {
    const track = await this.dataService.findOneTrack(itemId);
    if (!track) {
      throw new UnprocessableEntityException();
    }

    await this.dataService.addFavTrack(itemId);
  }

  async removeArtist(itemId: string) {
    if (!this.dataService.favStorage.artists.includes(itemId)) {
      throw new NotFoundException();
    }

    await this.dataService.removeFavArtist(itemId);
  }

  async removeAlbum(itemId: string) {
    if (!this.dataService.favStorage.albums.includes(itemId)) {
      throw new NotFoundException();
    }

    await this.dataService.removeFavAlbum(itemId);
  }

  async removeTrack(itemId: string) {
    if (!this.dataService.favStorage.tracks.includes(itemId)) {
      throw new NotFoundException();
    }

    await this.dataService.removeFavTrack(itemId);
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
      .filter((item) => !!item)
      .forEach((item) => favs.artists.push(item as Artist));

    (
      await Promise.all(
        this.dataService.favStorage.albums.map(
          this.albumService.findOne.bind(this),
        ),
      )
    )
      .filter((item) => !!item)
      .forEach((item) => favs.albums.push(item as Album));

    (
      await Promise.all(
        this.dataService.favStorage.tracks.map(
          this.trackService.findOne.bind(this),
        ),
      )
    )
      .filter((item) => !!item)
      .forEach((item) => favs.tracks.push(item as Track));

    return favs;
  }
}
