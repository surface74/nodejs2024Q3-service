import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import db from 'src/storage/data.service';
import { v4 as uuidv4, validate } from 'uuid';
import { ErrorMessage } from 'src/storage/types/error-message.enum';
import { DbResult } from 'src/storage/types/result.types';
import { Artist } from './entities/artist.entity';
import { FavoritesService } from 'src/favorites/favorites.service';
import { TrackService } from 'src/track/track.service';
import { AlbumService } from 'src/album/album.service';

@Injectable()
export class ArtistService {
  constructor(
    @Inject(forwardRef(() => AlbumService))
    private albumService: AlbumService,
    @Inject(forwardRef(() => TrackService))
    private trackService: TrackService,
    @Inject(forwardRef(() => FavoritesService))
    private favoritesService: FavoritesService,
  ) {}

  async create(createArtistDto: CreateArtistDto) {
    const { name, grammy } = createArtistDto;
    const artist: Artist = {
      id: uuidv4(),
      name,
      grammy,
    };

    await db.artistStorage.push(artist);
    return new DbResult({ data: { ...artist } });
  }

  async findAll() {
    const result = db.artistStorage.map((artist: Artist) => {
      return { ...artist };
    });
    return new DbResult({ data: result });
  }

  async findOne(id: string) {
    if (!validate(id)) {
      return new DbResult({ errorText: ErrorMessage.WRONG_UUID });
    }

    const index = await db.artistStorage.findIndex(
      (artist: Artist) => artist.id === id,
    );

    if (index > -1) {
      return new DbResult({ data: { ...db.artistStorage[index] } });
    }

    return new DbResult({
      errorText: ErrorMessage.RECORD_NOT_EXISTS,
    });
  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    if (!validate(id)) {
      return new DbResult({ errorText: ErrorMessage.WRONG_UUID });
    }

    const index = await db.artistStorage.findIndex(
      (artist: Artist) => artist.id === id,
    );

    if (index < 0) {
      return new DbResult({
        errorText: ErrorMessage.RECORD_NOT_EXISTS,
      });
    }

    if (updateArtistDto.name !== undefined)
      db.artistStorage[index].name = updateArtistDto.name;
    if (updateArtistDto.grammy !== undefined)
      db.artistStorage[index].grammy = updateArtistDto.grammy;

    return new DbResult({ data: { ...db.artistStorage[index] } });
  }

  async remove(id: string) {
    if (!validate(id)) {
      return new DbResult({ errorText: ErrorMessage.WRONG_UUID });
    }

    const index = await db.artistStorage.findIndex(
      (artist: Artist) => artist.id === id,
    );

    if (index < 0) {
      return new DbResult({ errorText: ErrorMessage.RECORD_NOT_EXISTS });
    }

    await this.favoritesService.removeArtist(id);
    await this.albumService.clearArtistId(id);
    await this.trackService.clearArtistId(id);

    db.artistStorage.splice(index, 1);

    return new DbResult({});
  }
}
