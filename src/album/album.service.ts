import { Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import db from 'src/storage/data.service';
import { v4 as uuidv4, validate } from 'uuid';
import { ErrorMessage } from 'src/storage/types/error-message.enum';
import { DbResult } from 'src/storage/types/result.types';
import { Album } from './entities/album.entity';

@Injectable()
export class AlbumService {
  async create(createAlbumDto: CreateAlbumDto) {
    const { name, year, artistId } = createAlbumDto;
    const album: Album = {
      id: uuidv4(),
      name,
      year,
      artistId: artistId ? artistId : null,
    };

    db.albumStorage.push(album);
    return new DbResult({ data: { ...album } });
  }

  async findAll() {
    const result = db.albumStorage.map((album: Album) => {
      return { ...album };
    });
    return new DbResult({ data: result });
  }

  async findOne(id: string) {
    if (validate(id)) {
      const index = await db.albumStorage.findIndex(
        (album: Album) => album.id === id,
      );

      if (index > -1) {
        return new DbResult({ data: { ...db.albumStorage[index] } });
      }

      return new DbResult({
        errorText: ErrorMessage.RECORD_NOT_EXISTS,
      });
    }

    return new DbResult({ errorText: ErrorMessage.WRONG_UUID });
  }

  async update(id: number, updateAlbumDto: UpdateAlbumDto) {
    return `This action updates a #${id} album`;
  }

  async remove(id: number) {
    return `This action removes a #${id} album`;
  }
}
