import { Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import db from 'src/storage/data.service';
import { v4 as uuidv4, validate } from 'uuid';
import { ErrorMessage } from 'src/storage/types/error-message.enum';
import { DbResult } from 'src/storage/types/result.types';
import { Track } from './entities/track.entity';

@Injectable()
export class TrackService {
  async create(createTrackDto: CreateTrackDto) {
    const track: Track = {
      id: uuidv4(),
      name: createTrackDto.name,
      artistId: createTrackDto.artistId ? createTrackDto.artistId : null,
      albumId: createTrackDto.albumId ? createTrackDto.albumId : null,
      duration: createTrackDto.duration,
    };

    await db.trackStorage.push(track);
    return new DbResult({ data: { ...track } });
  }

  async findAll() {
    const result = db.trackStorage.map((track: Track) => {
      return { ...track };
    });
    return new DbResult({ data: result });
  }

  async findOne(id: string) {
    if (validate(id)) {
      const index = await db.trackStorage.findIndex(
        (track: Track) => track.id === id,
      );

      if (index > -1) {
        return new DbResult({ data: { ...db.trackStorage[index] } });
      }

      return new DbResult({
        errorText: ErrorMessage.RECORD_NOT_EXISTS,
      });
    }

    return new DbResult({ errorText: ErrorMessage.WRONG_UUID });
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    return `This action updates a #${id} track`;
  }

  async remove(id: string) {
    return `This action removes a #${id} track`;
  }
}
