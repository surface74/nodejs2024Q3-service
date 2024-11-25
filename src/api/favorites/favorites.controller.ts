import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Res,
  HttpStatus,
  ParseUUIDPipe,
  Req,
  Inject,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { Request, Response } from 'express';

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
import { CustomLogger } from 'src/common/custom-logger/custom-logger.service';

@ApiTags('Favorites')
@Controller('favs')
export class FavoritesController {
  constructor(
    private readonly favoritesService: FavoritesService,
    @Inject(CustomLogger)
    private customLogger: CustomLogger,
  ) {
    this.customLogger.setContext(FavoritesController.name);
  }

  @Post('artist/:id')
  @ApiCreatedResponse({ description: Messages.ArtistAdded })
  @ApiBadRequestResponse({ description: 'Invalid UUID' })
  @ApiUnprocessableEntityResponse({ description: 'Not exist' })
  async addArtist(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    this.customLogger.logRequest(req);

    await this.favoritesService.addArtist(id);
    res.status(HttpStatus.CREATED);

    this.customLogger.logResponse(res);

    return Messages.ArtistAdded;
  }

  @Post('album/:id')
  @ApiCreatedResponse({ description: Messages.AlbumAdded })
  @ApiBadRequestResponse({ description: 'Invalid UUID' })
  @ApiUnprocessableEntityResponse({ description: 'Not exist' })
  async addAlbum(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    this.customLogger.logRequest(req);

    await this.favoritesService.addAlbum(id);
    res.status(HttpStatus.CREATED);

    this.customLogger.logResponse(res);

    return Messages.AlbumAdded;
  }

  @Post('track/:id')
  @ApiCreatedResponse({ description: Messages.TrackAdded })
  @ApiBadRequestResponse({ description: 'Invalid UUID' })
  @ApiUnprocessableEntityResponse({ description: 'Not exist' })
  async addTrack(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    this.customLogger.logRequest(req);

    await this.favoritesService.addTrack(id);
    res.status(HttpStatus.CREATED);

    this.customLogger.logResponse(res);

    return Messages.TrackAdded;
  }

  @Delete('artist/:id')
  @ApiNoContentResponse({ description: Messages.ArtistRemoved })
  @ApiBadRequestResponse({ description: 'Invalid UUID' })
  @ApiNotFoundResponse({ description: 'Not found' })
  async removeArtist(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    this.customLogger.logRequest(req);

    await this.favoritesService.removeArtist(id);
    res.status(HttpStatus.NO_CONTENT);

    this.customLogger.logResponse(res);

    return Messages.ArtistRemoved;
  }

  @Delete('album/:id')
  @ApiNoContentResponse({ description: Messages.AlbumRemoved })
  @ApiBadRequestResponse({ description: 'Invalid UUID' })
  @ApiNotFoundResponse({ description: 'Not found' })
  async removeAlbum(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    this.customLogger.logRequest(req);

    await this.favoritesService.removeAlbum(id);
    res.status(HttpStatus.NO_CONTENT);

    this.customLogger.logResponse(res);

    return Messages.AlbumRemoved;
  }

  @Delete('track/:id')
  @ApiNoContentResponse({ description: Messages.TrackRemoved })
  @ApiBadRequestResponse({ description: 'Invalid UUID' })
  @ApiNotFoundResponse({ description: 'Not found' })
  async removeTrack(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    this.customLogger.logRequest(req);

    await this.favoritesService.removeTrack(id);
    res.status(HttpStatus.NO_CONTENT);

    this.customLogger.logResponse(res);

    return Messages.TrackRemoved;
  }

  @Get()
  @ApiOkResponse({ description: 'OK', type: FavoritesResponse })
  async findAll(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    this.customLogger.logRequest(req);

    const result = await this.favoritesService.findAll();

    this.customLogger.logResponse(res);

    return result;
  }
}
