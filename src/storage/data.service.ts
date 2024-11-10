import { v4 as uuidv4 } from 'uuid';
import { User } from 'src/user/entities/user.entity';
import { Artist } from 'src/artist/entities/artist.entity';
import * as users from './fake-data/users.json';
import * as artists from './fake-data/artists.json';
import * as albums from './fake-data/albums.json';
import * as tracks from './fake-data/tracks.json';
import * as favs from './fake-data/favorites.json';
import { Album } from 'src/album/entities/album.entity';
import { Track } from 'src/track/entities/track.entity';
import { Favorite } from 'src/favorites/entities/favorite.entity';

class DataService {
  static instance: DataService = new DataService();

  public userStorage: User[] = new Array<User>();
  public artistStorage: Artist[] = new Array<Artist>();
  public albumStorage: Album[] = new Array<Album>();
  public trackStorage: Track[] = new Array<Track>();
  public favStorage: Favorite = {
    artists: new Array<string>(),
    albums: new Array<string>(),
    tracks: new Array<string>(),
  };

  private constructor() {
    if (!DataService.instance) DataService.instance = this;

    this.fillDatabase();
  }

  public static getInstance(): DataService {
    return DataService.instance;
  }

  private fillDatabase() {
    this.fillUsers();
    this.fillArtists();
    this.fillAlbums();
    this.fillTracks();
  }

  private fillFavs(): void {
    this.favStorage.albums.concat(...favs.albums);
    this.favStorage.artists.concat(...favs.artists);
    this.favStorage.tracks.concat(...favs.tracks);
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

export default DataService.getInstance();
