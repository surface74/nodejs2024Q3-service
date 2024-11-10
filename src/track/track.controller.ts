import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Res,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Response } from 'express';
import { DbResult } from 'src/storage/types/result.types';
import { ErrorMessage } from 'src/storage/types/error-message.enum';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Post()
  async create(
    @Body() createTrackDto: CreateTrackDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.trackService.create(createTrackDto);
    if (result.errorText) {
      res.status(HttpStatus.BAD_REQUEST);
      return result.errorText;
    }

    res.status(HttpStatus.CREATED);
    return result.data;
  }

  @Get()
  async findAll() {
    return (await this.trackService.findAll()).data;
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result: DbResult = await this.trackService.findOne(id);
    if (result.errorText) {
      switch (result.errorText) {
        case ErrorMessage.RECORD_NOT_EXISTS:
          res.status(HttpStatus.NOT_FOUND);
          break;
        case ErrorMessage.WRONG_UUID:
          res.status(HttpStatus.BAD_REQUEST);
          break;
        default:
          res.status(HttpStatus.BAD_REQUEST);
          break;
      }
      return result.errorText;
    }

    return result.data;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ) {
    return this.trackService.update(id, updateTrackDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.trackService.remove(id);
  }
}
