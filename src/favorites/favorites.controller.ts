import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Res,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { Response } from 'express';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { FavoritesResponse } from './entities/favorites-response.entity';
import { Messages } from './enums/messages.enum';

@ApiTags('Favorites')
@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post('artist/:id')
  @ApiCreatedResponse({ description: Messages.AlbumAdded })
  @ApiBadRequestResponse({ description: 'Invalid UUID' })
  @ApiUnprocessableEntityResponse({ description: 'Not exist' })
  async addArtist(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.favoritesService.addArtist(id);

    res.status(HttpStatus.CREATED);
    return Messages.AlbumAdded;
  }

  @Post('album/:id')
  @ApiCreatedResponse({ description: Messages.ArtistAdded })
  @ApiBadRequestResponse({ description: 'Invalid UUID' })
  @ApiUnprocessableEntityResponse({ description: 'Not exist' })
  async addAlbum(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.favoritesService.addAlbum(id);

    res.status(HttpStatus.CREATED);
    return Messages.ArtistAdded;
  }

  @Post('track/:id')
  @ApiCreatedResponse({ description: Messages.TrackAdded })
  @ApiBadRequestResponse({ description: 'Invalid UUID' })
  @ApiUnprocessableEntityResponse({ description: 'Not exist' })
  async addTrack(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.favoritesService.addTrack(id);

    res.status(HttpStatus.CREATED);
    return Messages.TrackAdded;
  }

  @Delete('artist/:id')
  @ApiNoContentResponse({ description: Messages.ArtistRemoved })
  @ApiBadRequestResponse({ description: 'Invalid UUID' })
  @ApiNotFoundResponse({ description: 'Not found' })
  async removeArtist(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.favoritesService.removeArtist(id);

    res.status(HttpStatus.NO_CONTENT);
    return Messages.ArtistRemoved;
  }

  @Delete('album/:id')
  @ApiNoContentResponse({ description: Messages.AlbumRemoved })
  @ApiBadRequestResponse({ description: 'Invalid UUID' })
  @ApiNotFoundResponse({ description: 'Not found' })
  async removeAlbum(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.favoritesService.removeAlbum(id);

    res.status(HttpStatus.NO_CONTENT);
    return Messages.AlbumRemoved;
  }

  @Delete('track/:id')
  @ApiNoContentResponse({ description: Messages.TrackRemoved })
  @ApiBadRequestResponse({ description: 'Invalid UUID' })
  @ApiNotFoundResponse({ description: 'Not found' })
  async removeTrack(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.favoritesService.removeTrack(id);

    res.status(HttpStatus.NO_CONTENT);
    return Messages.TrackRemoved;
  }

  @Get()
  @ApiOkResponse({ description: 'OK', type: FavoritesResponse })
  async findAll() {
    return await this.favoritesService.findAll();
  }
}
