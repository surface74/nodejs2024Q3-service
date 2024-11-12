import { User } from 'src/user/entities/user.entity';
import { Artist } from 'src/artist/entities/artist.entity';
import * as users from './mock-data/users.json';
import * as artists from './mock-data/artists.json';
import * as albums from './mock-data/albums.json';
import * as tracks from './mock-data/tracks.json';
import * as favs from './mock-data/favorites.json';
import { Album } from 'src/album/entities/album.entity';
import { Track } from 'src/track/entities/track.entity';
import { Favorite } from 'src/favorites/entities/favorite.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TestService {
  static instance: TestService = new TestService();

  public userStorage: User[] = new Array<User>();
  public artistStorage: Artist[] = new Array<Artist>();
  public albumStorage: Album[] = new Array<Album>();
  public trackStorage: Track[] = new Array<Track>();
  public favStorage: Favorite = {
    artists: new Array<string>(),
    albums: new Array<string>(),
    tracks: new Array<string>(),
  };

  constructor() {
    if (!TestService.instance) TestService.instance = this;

    this.fillDatabase();
  }

  public static getInstance(): TestService {
    return TestService.instance;
  }

  private fillDatabase() {
    this.fillUsers();
    this.fillArtists();
    this.fillAlbums();
    this.fillTracks();
    this.fillFavs();
  }

  private fillFavs(): void {
    favs.albums.forEach((id: string) => this.favStorage.albums.push(id));
    favs.artists.forEach((id: string) => this.favStorage.artists.push(id));
    favs.tracks.forEach((id: string) => this.favStorage.tracks.push(id));
  }

  private fillTracks(): void {
    tracks.forEach((track: Track) => this.trackStorage.push(track));
  }

  private fillAlbums(): void {
    albums.forEach((album: Album) => this.albumStorage.push(album));
  }

  private fillArtists(): void {
    artists.forEach((artist: Pick<Artist, 'id' | 'name' | 'grammy'>) => {
      const { id, name, grammy } = artist;
      const newArtist = {
        id,
        name,
        grammy,
      };
      this.artistStorage.push(newArtist);
    });
  }

  private fillUsers(): void {
    users.forEach((user: Pick<User, 'id' | 'login' | 'password'>) => {
      const { id, login, password } = user;
      const newUser = {
        id,
        login,
        password,
        version: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      this.userStorage.push(newUser);
    });
  }
}

export default TestService.getInstance();
