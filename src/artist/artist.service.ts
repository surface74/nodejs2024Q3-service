import { Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import db from 'src/storage/data.service';
import { v4 as uuidv4, validate } from 'uuid';
import { ErrorMessage } from 'src/storage/types/error-message.enum';
import { DbResult } from 'src/storage/types/result.types';
import { Artist } from './entities/artist.entity';

@Injectable()
export class ArtistService {
  async create(createArtistDto: CreateArtistDto) {
    if (createArtistDto.name) {
      const artist: Artist = {
        id: uuidv4(),
        name: createArtistDto.name,
        grammy: !!createArtistDto.grammy,
      };

      db.artistStorage.push(artist);
      return new DbResult({ data: { ...artist } });
    }

    return new DbResult({ errorText: ErrorMessage.BAD_REQUEST });
  }

  async findAll() {
    const result = db.artistStorage.map((artist: Artist) => {
      return { ...artist };
    });
    return new DbResult({ data: result });
  }

  async findOne(id: string) {
    if (validate(id)) {
      const result = await db.artistStorage.filter(
        (artist: Artist) => artist.id === id,
      );

      if (result.length > 0) {
        return new DbResult({ data: { ...result[0] } });
      }

      return new DbResult({
        errorText: ErrorMessage.RECORD_NOT_EXISTS,
      });
    }

    return new DbResult({ errorText: ErrorMessage.WRONG_UUID });
  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    if (validate(id)) {
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

    return new DbResult({ errorText: ErrorMessage.WRONG_UUID });
  }

  async remove(id: string) {
    if (validate(id)) {
      const index = await db.artistStorage.findIndex(
        (artist: Artist) => artist.id === id,
      );

      if (index < 0) {
        return new DbResult({ errorText: ErrorMessage.RECORD_NOT_EXISTS });
      }

      db.artistStorage.splice(index, 1);

      return new DbResult({});
    }

    return new DbResult({ errorText: ErrorMessage.WRONG_UUID });
  }
}
