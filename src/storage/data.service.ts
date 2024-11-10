import { v4 as uuidv4 } from 'uuid';
import { User } from 'src/user/entities/user.entity';
import { Artist } from 'src/artist/entities/artist.entity';
import * as users from './fake-data/users.json';
import * as artists from './fake-data/artists.json';
import * as albums from './fake-data/albums.json';
import { Album } from 'src/album/entities/album.entity';

class DataService {
  static instance: DataService = new DataService();

  public userStorage: User[] = new Array<User>();
  public artistStorage: Artist[] = new Array<Artist>();
  public albumStorage: Album[] = new Array<Album>();

  private constructor() {
    if (!DataService.instance) DataService.instance = this;

    this.fillUsers();
    this.fillArtists();
    this.fillAlbums();
  }

  public static getInstance(): DataService {
    return DataService.instance;
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
