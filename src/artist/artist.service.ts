import { Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import db from 'src/storage/data.service';
import { v4 as uuidv4, validate } from 'uuid';
import { ErrorMessage } from 'src/storage/types/error-message.enum';
import { DbResult } from 'src/storage/types/result.types';
import { Artist } from './entities/artist.entity';
import { Album } from 'src/album/entities/album.entity';
import { Track } from 'src/track/entities/track.entity';

@Injectable()
export class ArtistService {
  async create(createArtistDto: CreateArtistDto) {
    const artist: Artist = {
      id: uuidv4(),
      name: createArtistDto.name,
      grammy: !!createArtistDto.grammy,
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

    await this.removeFavArtist(id);
    await this.removeAlbumArtist(id);
    await this.removeTrackArtist(id);

    db.artistStorage.splice(index, 1);

    return new DbResult({});
  }

  async removeFavArtist(itemId: string) {
    const index = await db.favStorage.artists.findIndex(
      (id: string) => itemId === id,
    );
    if (index > -1) {
      await db.favStorage.artists.splice(index, 1);
    }
  }

  async removeAlbumArtist(id: string) {
    const index = await db.albumStorage.findIndex(
      ({ artistId }: Album) => artistId === id,
    );
    if (index > -1) {
      db.albumStorage[index].artistId = null;
    }
  }

  async removeTrackArtist(id: string) {
    const index = await db.trackStorage.findIndex(
      ({ artistId }: Track) => artistId === id,
    );
    if (index > -1) {
      db.trackStorage[index].artistId = null;
    }
  }
}
