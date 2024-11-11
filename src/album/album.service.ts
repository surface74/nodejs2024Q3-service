import { Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import db from 'src/storage/data.service';
import { v4 as uuidv4, validate } from 'uuid';
import { ErrorMessage } from 'src/storage/types/error-message.enum';
import { DbResult } from 'src/storage/types/result.types';
import { Album } from './entities/album.entity';
import { Track } from 'src/track/entities/track.entity';

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

  async update(id: string, updateAlbumDto: UpdateAlbumDto) {
    if (validate(id)) {
      const index = await db.albumStorage.findIndex(
        (album: Album) => album.id === id,
      );

      if (index < 0) {
        return new DbResult({
          errorText: ErrorMessage.RECORD_NOT_EXISTS,
        });
      }

      const album = db.albumStorage[index];
      if (updateAlbumDto.name !== undefined) album.name = updateAlbumDto.name;
      if (updateAlbumDto.year !== undefined) album.year = updateAlbumDto.year;
      if (updateAlbumDto.artistId !== undefined)
        album.artistId = updateAlbumDto.artistId;

      return new DbResult({ data: { ...db.albumStorage[index] } });
    }

    return new DbResult({ errorText: ErrorMessage.WRONG_UUID });
  }

  async remove(id: string) {
    if (validate(id)) {
      const index = await db.albumStorage.findIndex(
        (album: Album) => album.id === id,
      );

      if (index < 0) {
        return new DbResult({ errorText: ErrorMessage.RECORD_NOT_EXISTS });
      }

      await this.removeFavAlbum(id);
      await this.removeTrackAlbum(id);

      await db.albumStorage.splice(index, 1);

      return new DbResult({});
    }

    return new DbResult({ errorText: ErrorMessage.WRONG_UUID });
  }

  async removeFavAlbum(itemId: string) {
    const index = await db.favStorage.albums.findIndex(
      (id: string) => itemId === id,
    );
    if (index > -1) {
      await db.favStorage.albums.splice(index, 1);
    }
  }

  async removeTrackAlbum(id: string) {
    const index = await db.trackStorage.findIndex(
      ({ albumId }: Track) => albumId === id,
    );
    if (index > -1) {
      db.trackStorage[index].albumId = null;
    }
  }
}
