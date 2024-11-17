import { User } from 'src/user/entities/user.entity';
import { Artist } from 'src/artist/entities/artist.entity';
import * as users from './mock-data/users.json';
import * as artists from './mock-data/artists.json';
import * as albums from './mock-data/albums.json';
import * as tracks from './mock-data/tracks.json';
import * as favs from './mock-data/favorites.json';
import { v4 as uuidv4 } from 'uuid';
import { Album } from 'src/album/entities/album.entity';
import { Track } from 'src/track/entities/track.entity';
import { Favorite } from 'src/favorites/entities/favorite.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { IDataEntity } from './types/data-entity.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class DataService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Album)
    private albumsRepository: Repository<Album>,
    @InjectRepository(Artist)
    private artistsRepository: Repository<Artist>,
    @InjectRepository(Track)
    private tracksRepository: Repository<Track>,
    @InjectRepository(Favorite)
    private favsRepository: Repository<Favorite>,
  ) {
    this.fillDatabase();
  }

  public userStorage: User[] = new Array<User>();
  public artistStorage: Artist[] = new Array<Artist>();
  public albumStorage: Album[] = new Array<Album>();
  public trackStorage: Track[] = new Array<Track>();
  public favStorage: Favorite = {
    id: uuidv4(),
    artists: new Array<string>(),
    albums: new Array<string>(),
    tracks: new Array<string>(),
  };

  async removeFavArtist(itemId: string) {
    const index = this.favStorage.artists.findIndex(
      (id: string) => id === itemId,
    );

    if (index > -1) {
      this.favStorage.artists.splice(index, 1);
    }
  }

  async removeFavTrack(itemId: string) {
    const index = this.favStorage.tracks.findIndex(
      (id: string) => id === itemId,
    );

    if (index > -1) {
      this.favStorage.tracks.splice(index, 1);
    }
  }

  async removeFavAlbum(itemId: string) {
    const index = this.favStorage.albums.findIndex(
      (id: string) => id === itemId,
    );

    if (index > -1) {
      this.favStorage.albums.splice(index, 1);
    }
  }

  async addFavArtist(id: string) {
    if (!this.favStorage.artists.includes(id)) {
      this.favStorage.artists.push(id);
    }
  }

  async addFavAlbum(id: string) {
    if (!this.favStorage.albums.includes(id)) {
      this.favStorage.albums.push(id);
    }
  }

  async addFavTrack(id: string) {
    if (!this.favStorage.tracks.includes(id)) {
      this.favStorage.tracks.push(id);
    }
  }

  async createTrack(track: Track) {
    await this.trackStorage.push(track);
    return track;
  }

  async createArtist(artist: Artist) {
    await this.artistStorage.push(artist);
    return artist;
  }

  async createAlbum(album: Album) {
    await this.albumStorage.push(album);
    return album;
  }

  async createUser(user: User) {
    await this.userStorage.push(user);
    return user;
  }

  async findAllTracks() {
    return this.trackStorage;
  }

  async findAllAlbums() {
    return this.albumStorage;
  }

  async findAllArtists() {
    return this.artistStorage;
  }

  async findAllUsers() {
    return this.userStorage;
  }

  async findOneAlbum(id: string) {
    const entity = this.albumStorage.find(
      (item: IDataEntity) => item.id === id,
    );

    return entity || null;
  }

  async findOneArtist(id: string) {
    const entity = this.artistStorage.find(
      (item: IDataEntity) => item.id === id,
    );

    return entity || null;
  }

  async findOneTrack(id: string) {
    const entity = this.trackStorage.find(
      (item: IDataEntity) => item.id === id,
    );

    return entity || null;
  }

  async findOneUser(id: string) {
    const entity = this.userStorage.find((item: IDataEntity) => item.id === id);

    return entity || null;
  }

  async updateAlbum(updatedAlbum: Album) {
    const index = this.albumStorage.findIndex(
      (item: IDataEntity) => item.id === updatedAlbum.id,
    );

    if (index === -1) {
      throw new NotFoundException();
    }

    this.albumStorage[index] = {
      ...this.albumStorage[index],
      ...updatedAlbum,
    };

    return this.albumStorage[index];
  }

  async updateArtist(updatedArtist: Artist) {
    const index = this.artistStorage.findIndex(
      (item: IDataEntity) => item.id === updatedArtist.id,
    );

    if (index === -1) {
      throw new NotFoundException();
    }

    this.artistStorage[index] = {
      ...this.artistStorage[index],
      ...updatedArtist,
    };

    return this.artistStorage[index];
  }

  async updateTrack(updatedTrack: Track) {
    const index = this.trackStorage.findIndex(
      (item: IDataEntity) => item.id === updatedTrack.id,
    );

    if (index === -1) {
      throw new NotFoundException();
    }

    this.trackStorage[index] = {
      ...this.trackStorage[index],
      ...updatedTrack,
    };

    return this.trackStorage[index];
  }

  async updateUser(updatedUser: User) {
    const index = this.userStorage.findIndex(
      (user: IDataEntity) => user.id === updatedUser.id,
    );
    if (index > -1) {
      this.userStorage[index] = { ...this.userStorage[index], ...updatedUser };
    }

    return this.userStorage[index];
  }

  async removeTrack(id: string) {
    const index = this.trackStorage.findIndex(
      (item: IDataEntity) => item.id === id,
    );
    if (index > -1) {
      this.trackStorage.splice(index, 1);
    }
  }

  async removeArtist(id: string) {
    const index = this.artistStorage.findIndex(
      (item: IDataEntity) => item.id === id,
    );
    if (index > -1) {
      this.artistStorage.splice(index, 1);
    }
  }

  async removeAlbum(id: string) {
    const index = this.albumStorage.findIndex(
      (item: IDataEntity) => item.id === id,
    );
    if (index > -1) {
      this.albumStorage.splice(index, 1);
    }
  }

  async removeUser(id: string) {
    const index = this.userStorage.findIndex(
      (item: IDataEntity) => item.id === id,
    );
    if (index === -1) {
      throw new NotFoundException();
    }

    this.userStorage.splice(index, 1);
  }

  async handleRemovalArtist(artistId: string) {
    const artist: Artist = await this.findOneArtist(artistId);
    if (!artist) {
      throw new NotFoundException();
    }

    const album = await this.albumStorage.find(
      (item: Album) => artistId === item.artistId,
    );
    if (album) {
      album.artistId = null;
    }

    const track = await this.trackStorage.find(
      (item: Track) => artistId === item.artistId,
    );
    if (track) {
      track.artistId = null;
    }

    await this.removeFavArtist(artistId);
    await this.removeArtist(artistId);
  }

  async handleRemovalAlbum(albumId: string) {
    const album: Album = await this.findOneAlbum(albumId);
    if (!album) {
      throw new NotFoundException();
    }

    const trackIndex = await this.trackStorage.findIndex(
      (item: Track) => albumId === item.albumId,
    );

    if (trackIndex > -1) {
      this.trackStorage[trackIndex].albumId = null;
    }

    await this.removeFavAlbum(albumId);
    await this.removeAlbum(albumId);
  }

  async handleRemovalTrack(trackId: string) {
    const track = await this.findOneTrack(trackId);
    if (!track) {
      throw new NotFoundException();
    }

    await this.removeFavTrack(trackId);
    await this.removeTrack(trackId);
  }

  private async fillDatabase() {
    await this.fillUsers();
    await this.fillArtists();
    await this.fillAlbums();
    await this.fillTracks();
    await this.fillFavs();
  }

  private async fillFavs() {
    favs.albums.forEach((id: string) => this.favStorage.albums.push(id));
    favs.artists.forEach((id: string) => this.favStorage.artists.push(id));
    favs.tracks.forEach((id: string) => this.favStorage.tracks.push(id));

    const favorites = await this.favsRepository.find();
    const id = favorites.length ? favorites[0].id : uuidv4();

    const favorite: Favorite = {
      id,
      albums: favs.albums,
      artists: favs.artists,
      tracks: favs.tracks,
    };

    await this.favsRepository.save(favorite);
  }

  private fillTracks(): void {
    tracks.forEach(async (track: Track) => {
      await this.tracksRepository.save(track);

      this.trackStorage.push(track);
    });
  }

  private fillAlbums(): void {
    albums.forEach(async (album: Album) => {
      await this.albumsRepository.save(album);

      this.albumStorage.push(album);
    });
  }

  private fillArtists(): void {
    artists.forEach(async (artist: Pick<Artist, 'id' | 'name' | 'grammy'>) => {
      const { id, name, grammy } = artist;
      const newArtist = {
        id,
        name,
        grammy,
      };

      await this.artistsRepository.save(newArtist);

      this.artistStorage.push(newArtist);
    });
  }

  private fillUsers(): void {
    users.forEach(async (user: Pick<User, 'id' | 'login' | 'password'>) => {
      const { id, login, password } = user;
      const newUser = {
        id,
        login,
        password,
        version: 1,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await this.usersRepository.save(newUser);

      this.userStorage.push(newUser);
    });
  }
}
