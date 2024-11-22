import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { DataService } from 'src/database/data.service';
import { v4 as uuidv4 } from 'uuid';
import { Track } from './entities/track.entity';
import { FavoritesService } from 'src/api/favorites/favorites.service';

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
    return await this.dataService.findOneTrack(id);
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    const track = await this.dataService.findOneTrack(id);

    return await this.dataService.updateTrack({ ...track, ...updateTrackDto });
  }

  async remove(id: string) {
    await this.dataService.handleRemovalTrack(id);
  }
}
