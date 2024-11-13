import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { DataService } from 'src/storage/data.service';
import { v4 as uuidv4 } from 'uuid';
import { Artist } from './entities/artist.entity';
import { FavoritesService } from 'src/favorites/favorites.service';
import { TrackService } from 'src/track/track.service';
import { AlbumService } from 'src/album/album.service';

@Injectable()
export class ArtistService {
  constructor(
    private dataService: DataService,
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

    return await this.dataService.createArtist(artist);
  }

  async findAll() {
    return await this.dataService.findAllArtists();
  }

  async findOne(id: string) {
    return await this.dataService.findOneArtist(id);
  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    const artist = await this.dataService.findOneArtist(id);

    if (!artist) {
      throw new NotFoundException();
    }

    if (updateArtistDto.name) artist.name = updateArtistDto.name;
    if (updateArtistDto.grammy !== undefined) {
      artist.grammy = updateArtistDto.grammy;
    }

    return await this.dataService.updateArtist(artist);
  }

  async remove(id: string) {
    await this.dataService.handleRemovalArtist(id);
  }
}
