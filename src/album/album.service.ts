import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { DataService } from 'src/database/data.service';
import { v4 as uuidv4 } from 'uuid';
import { Album } from './entities/album.entity';
import { FavoritesService } from 'src/favorites/favorites.service';
import { TrackService } from 'src/track/track.service';

@Injectable()
export class AlbumService {
  constructor(
    private dataService: DataService,
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

    return await this.dataService.createAlbum(album);
  }

  async findAll() {
    return await this.dataService.findAllAlbums();
  }

  async findOne(id: string) {
    const album = await this.dataService.findOneAlbum(id);
    if (!album) {
      throw new NotFoundException();
    }

    return album;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const album = await this.dataService.findOneAlbum(id);
    if (!album) {
      throw new NotFoundException();
    }

    if (updateAlbumDto.name) album.name = updateAlbumDto.name;
    if (updateAlbumDto.year) album.year = updateAlbumDto.year;
    if (updateAlbumDto.artistId) album.artistId = updateAlbumDto.artistId;

    return await this.dataService.updateAlbum(album);
  }

  async remove(id: string) {
    await this.dataService.handleRemovalAlbum(id);
  }
}
