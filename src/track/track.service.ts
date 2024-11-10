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
    if (!validate(id)) {
      return new DbResult({ errorText: ErrorMessage.WRONG_UUID });
    }

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

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    if (!validate(id)) {
      return new DbResult({ errorText: ErrorMessage.WRONG_UUID });
    }

    const index = await db.trackStorage.findIndex(
      (track: Track) => track.id === id,
    );

    if (index < 0) {
      return new DbResult({
        errorText: ErrorMessage.RECORD_NOT_EXISTS,
      });
    }

    const track = db.trackStorage[index];
    if (updateTrackDto.name !== undefined) track.name = updateTrackDto.name;
    if (updateTrackDto.artistId !== undefined)
      track.artistId = updateTrackDto.artistId;
    if (updateTrackDto.albumId !== undefined)
      track.albumId = updateTrackDto.albumId;
    if (updateTrackDto.duration !== undefined)
      track.duration = updateTrackDto.duration;

    return new DbResult({ data: { ...track } });
  }

  async remove(id: string) {
    if (!validate(id)) {
      return new DbResult({ errorText: ErrorMessage.WRONG_UUID });
    }

    const index = await db.trackStorage.findIndex(
      (track: Track) => track.id === id,
    );

    if (index < 0) {
      return new DbResult({ errorText: ErrorMessage.RECORD_NOT_EXISTS });
    }

    db.trackStorage.splice(index, 1);

    return new DbResult({});
  }
}
