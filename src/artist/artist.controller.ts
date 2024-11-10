import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { ErrorMessage } from 'src/storage/types/error-message.enum';
import { Response } from 'express';
import { DbResult } from 'src/storage/types/result.types';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Post()
  async create(
    @Body() createArtistDto: CreateArtistDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.artistService.create(createArtistDto);
    if (result.errorText) {
      res.status(HttpStatus.BAD_REQUEST);
      return result.errorText;
    }
    return result.data;
  }

  @Get()
  async findAll() {
    return (await this.artistService.findAll()).data;
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result: DbResult = await this.artistService.findOne(id);
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

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateArtistDto: UpdateArtistDto,
  ) {
    return this.artistService.update(+id, updateArtistDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.artistService.remove(+id);
  }
}
