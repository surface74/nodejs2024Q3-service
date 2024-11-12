import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import db from 'src/storage/data.service';
import { v4 as uuidv4, validate } from 'uuid';
import { ErrorMessage } from 'src/storage/types/error-message.enum';
import { DbResult } from 'src/storage/types/result.types';
import { Album } from './entities/album.entity';
import { FavoritesService } from 'src/favorites/favorites.service';
import { TrackService } from 'src/track/track.service';

@Injectable()
export class AlbumService {
  constructor(
    @Inject(forwardRef(() => TrackService))
    private trackService: TrackService,
    @Inject(forwardRef(() => FavoritesService))
    private favoritesService: FavoritesService,
  ) {}

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

      await this.favoritesService.removeAlbum(id);
      await this.trackService.clearAlbumId(id);

      await db.albumStorage.splice(index, 1);

      return new DbResult({});
    }

    return new DbResult({ errorText: ErrorMessage.WRONG_UUID });
  }

  async clearArtistId(artistId: string) {
    const index = await db.albumStorage.findIndex(
      ({ artistId: id }: Album) => artistId === id,
    );
    if (index > -1) {
      db.albumStorage[index].artistId = null;
    }
  }
}
