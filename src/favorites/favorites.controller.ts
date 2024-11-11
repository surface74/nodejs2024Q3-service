import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { Response } from 'express';
import { ErrorMessage } from 'src/storage/types/error-message.enum';
import { DbResult } from 'src/storage/types/result.types';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post('track/:id')
  async addTrack(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result: DbResult = await this.favoritesService.addTrack(id);
    if (result.errorText) {
      switch (result.errorText) {
        case ErrorMessage.RECORD_NOT_EXISTS:
          res.status(HttpStatus.UNPROCESSABLE_ENTITY);
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

    res.status(HttpStatus.CREATED);
    return result.data;
  }

  @Delete('track/:id')
  async removeTrack(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result: DbResult = await this.favoritesService.removeTrack(id);
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

    res.status(HttpStatus.NO_CONTENT);
    return result.data;
  }

  @Get()
  async findAll() {
    return await this.favoritesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.favoritesService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateFavoriteDto: UpdateFavoriteDto,
  ) {
    return await this.favoritesService.update(+id, updateFavoriteDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.favoritesService.remove(+id);
  }
}
