import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { DataService } from 'src/storage/data.service';
import { v4 as uuidv4 } from 'uuid';
import { Track } from './entities/track.entity';
import { FavoritesService } from 'src/favorites/favorites.service';

@Injectable()
export class TrackService {
  constructor(
    private dataService: DataService,
    @Inject(forwardRef(() => FavoritesService))
    private favoritesService: FavoritesService,
  ) {}

  async create(createTrackDto: CreateTrackDto) {
    const track: Track = {
      id: uuidv4(),
      name: createTrackDto.name,
      artistId: createTrackDto.artistId ? createTrackDto.artistId : null,
      albumId: createTrackDto.albumId ? createTrackDto.albumId : null,
      duration: createTrackDto.duration,
    };

    return await this.dataService.createTrack(track);
  }

  async findAll() {
    return await this.dataService.findAllTracks();
  }

  async findOne(id: string) {
    const track = await this.dataService.findOneTrack(id);
    if (!track) {
      throw new NotFoundException();
    }

    return track;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    const track = await this.dataService.findOneTrack(id);
    if (!track) {
      throw new NotFoundException();
    }

    if (updateTrackDto.name) track.name = updateTrackDto.name;
    if (updateTrackDto.artistId) track.artistId = updateTrackDto.artistId;
    if (updateTrackDto.albumId) track.albumId = updateTrackDto.albumId;
    if (updateTrackDto.duration) track.duration = updateTrackDto.duration;

    return await this.dataService.updateTrack(track);
  }

  async remove(id: string) {
    await this.dataService.handleRemovalTrack(id);
  }
}
