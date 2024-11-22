import { User } from 'src/api/user/entities/user.entity';
import { Artist } from 'src/api/artist/entities/artist.entity';
import * as users from './mock-data/users.json';
import * as artists from './mock-data/artists.json';
import * as albums from './mock-data/albums.json';
import * as tracks from './mock-data/tracks.json';
import * as favs from './mock-data/favorites.json';
import { v4 as uuidv4 } from 'uuid';
import { Album } from 'src/api/album/entities/album.entity';
import { Track } from 'src/api/track/entities/track.entity';
import { Favorite } from 'src/api/favorites/entities/favorite.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
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
    if (process.env.LOAD_MOCK_DATA === 'true') {
      this.fillDatabase();
    }
  }

  async findFavorites() {
    return await this.favsRepository.find();
  }

  async removeFavArtist(itemId: string) {
    const favs = await this.favsRepository.find();

    if (favs.length) {
      const favorite = favs[0];
      const index = favorite.artists.findIndex((id) => itemId === id);
      if (index > -1) {
        favorite.artists.splice(index, 1);
        await this.favsRepository.save(favorite);
        return favorite;
      }
    }

    return null;
  }

  async removeFavTrack(itemId: string) {
    const favs = await this.favsRepository.find();

    if (favs.length) {
      const favorite = favs[0];
      const index = favorite.tracks.findIndex((id) => itemId === id);
      if (index > -1) {
        favorite.tracks.splice(index, 1);
        await this.favsRepository.save(favorite);
        return favorite;
      }
    }

    return null;
  }

  async removeFavAlbum(itemId: string) {
    const favs = await this.favsRepository.find();

    if (favs.length) {
      const favorite = favs[0];
      const index = favorite.albums.findIndex((id) => itemId === id);
      if (index > -1) {
        favorite.albums.splice(index, 1);
        await this.favsRepository.save(favorite);
        return favorite;
      }
    }

    return null;
  }

  async addFavArtist(id: string) {
    await this.findOneArtist(id);

    const favs = await this.favsRepository.find();
    if (favs.length) {
      const favorite = favs[0];
      if (!favorite.artists.includes(id)) {
        favorite.artists.push(id);
        await this.favsRepository.save(favorite);
      }
    } else {
      const favorite = this.getNewFavorite();
      favorite.artists.push(id);
      await this.favsRepository.save(favorite);
    }
  }

  async addFavAlbum(id: string) {
    await this.findOneAlbum(id);

    const favs = await this.favsRepository.find();
    if (favs.length) {
      const favorite = favs[0];
      if (!favorite.albums.includes(id)) {
        favorite.albums.push(id);
        await this.favsRepository.save(favorite);
      }
    } else {
      const favorite = this.getNewFavorite();
      favorite.albums.push(id);
      await this.favsRepository.save(favorite);
    }
  }

  async addFavTrack(id: string) {
    await this.findOneTrack(id);

    const favs = await this.favsRepository.find();
    if (favs.length) {
      const favorite = favs[0];
      if (!favorite.tracks.includes(id)) {
        favorite.tracks.push(id);
        await this.favsRepository.save(favorite);
      }
    } else {
      const favorite = this.getNewFavorite();
      favorite.tracks.push(id);
      await this.favsRepository.save(favorite);
    }
  }

  async createTrack(track: Track) {
    return await this.tracksRepository.save(track);
  }

  async createArtist(artist: Artist) {
    return await this.artistsRepository.save(artist);
  }

  async createAlbum(album: Album) {
    return await this.albumsRepository.save(album);
  }

  async createUser(user: User) {
    return await this.usersRepository.save(user);
  }

  async findAllTracks() {
    return this.tracksRepository.find();
  }

  async findAllAlbums() {
    return this.albumsRepository.find();
  }

  async findAllArtists() {
    return this.artistsRepository.find();
  }

  async findAllUsers() {
    return this.usersRepository.find();
  }

  async findOneAlbum(id: string) {
    const entity = await this.albumsRepository.findOneBy({ id });
    if (!entity) {
      throw new NotFoundException();
    }
    return entity;
  }

  async findOneArtist(id: string) {
    const entity = await this.artistsRepository.findOneBy({ id });
    if (!entity) {
      throw new NotFoundException();
    }
    return entity;
  }

  async findOneTrack(id: string) {
    const entity = await this.tracksRepository.findOneBy({ id });
    if (!entity) {
      throw new NotFoundException();
    }
    return entity;
  }

  async findOneUser(id: string) {
    const entity = await this.usersRepository.findOneBy({ id });
    if (!entity) {
      throw new NotFoundException();
    }
    return entity;
  }

  async updateAlbum(updatedAlbum: Album) {
    const entity = await this.findOneAlbum(updatedAlbum.id);

    return this.albumsRepository.save({ ...entity, ...updatedAlbum });
  }

  async updateArtist(updatedArtist: Artist) {
    const entity = await this.findOneArtist(updatedArtist.id);

    return this.artistsRepository.save({ ...entity, ...updatedArtist });
  }

  async updateTrack(updatedTrack: Track) {
    const entity = await this.findOneTrack(updatedTrack.id);

    return this.tracksRepository.save({ ...entity, ...updatedTrack });
  }

  async updateUser(updatedUser: User) {
    const entity = await this.findOneUser(updatedUser.id);

    return this.usersRepository.save({ ...entity, ...updatedUser });
  }

  private async removeTrack(id: string) {
    const entity = await this.findOneTrack(id);
    this.tracksRepository.remove(entity);
  }

  private async removeArtist(id: string) {
    const entity = await this.findOneArtist(id);
    this.artistsRepository.remove(entity);
  }

  private async removeAlbum(id: string) {
    const entity = await this.findOneAlbum(id);
    this.albumsRepository.remove(entity);
  }

  async removeUser(id: string) {
    const entity = await this.findOneUser(id);
    await this.usersRepository.remove(entity);
  }

  async handleRemovalArtist(artistId: string) {
    const albums = await this.albumsRepository.find({ where: { artistId } });
    await Promise.all(
      albums.map((album) =>
        this.albumsRepository.save({ ...album, artistId: null }),
      ),
    );

    const tracks = await this.tracksRepository.find({ where: { artistId } });
    await Promise.all(
      tracks.map((track) =>
        this.tracksRepository.save({ ...track, artistId: null }),
      ),
    );

    await this.removeFavArtist(artistId);

    const artist = await this.findOneArtist(artistId);

    await this.artistsRepository.remove(artist);
  }

  async handleRemovalAlbum(albumId: string) {
    const tracks = await this.tracksRepository.find({ where: { albumId } });
    await Promise.all(
      tracks.map((track) =>
        this.tracksRepository.save({ ...track, albumId: null }),
      ),
    );

    await this.removeFavAlbum(albumId);

    const album = await this.findOneAlbum(albumId);
    await this.albumsRepository.remove(album);
  }

  async handleRemovalTrack(trackId: string) {
    await this.removeFavTrack(trackId);

    const track = await this.findOneTrack(trackId);
    await this.tracksRepository.remove(track);
  }

  private async fillDatabase() {
    await this.fillUsers();
    await this.fillArtists();
    await this.fillAlbums();
    await this.fillTracks();
    await this.fillFavs();
  }

  private async fillFavs() {
    const favorites = await this.favsRepository.find();
    const id = favorites.length ? favorites[0].id : uuidv4();

    const favorite: Favorite = {
      id,
      albums: [...favs.albums],
      artists: [...favs.artists],
      tracks: [...favs.tracks],
    };

    await this.favsRepository.save(favorite);
  }

  private fillTracks(): void {
    tracks.forEach(async (track: Track) => {
      await this.tracksRepository.save(track);
    });
  }

  private fillAlbums(): void {
    albums.forEach(async (album: Album) => {
      await this.albumsRepository.save(album);
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
    });
  }

  private getNewFavorite(): Favorite {
    return {
      id: uuidv4(),
      artists: new Array<string>(),
      albums: new Array<string>(),
      tracks: new Array<string>(),
    };
  }
}
