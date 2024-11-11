import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { Response } from 'express';
import { ErrorMessage } from 'src/storage/types/error-message.enum';
import { DbResult } from 'src/storage/types/result.types';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post('album/:id')
  async addAlbum(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result: DbResult = await this.favoritesService.addAlbum(id);
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

  @Delete('album/:id')
  async removeAlbum(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result: DbResult = await this.favoritesService.removeAlbum(id);
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
}
