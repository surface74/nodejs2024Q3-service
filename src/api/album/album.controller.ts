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
  ParseUUIDPipe,
  Req,
  Inject,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Request, Response } from 'express';

import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Album } from './entities/album.entity';
import { CustomLogger } from 'src/common/custom-logger/custom-logger.service';

@ApiBearerAuth()
@ApiTags('Album')
@Controller('album')
export class AlbumController {
  constructor(
    private readonly albumService: AlbumService,
    @Inject(CustomLogger)
    private customLogger: CustomLogger,
  ) {
    this.customLogger.setContext(AlbumController.name);
  }

  @Post()
  @ApiCreatedResponse({ description: 'Created', type: Album })
  @ApiBadRequestResponse({
    description: 'Request body does not contain required fields',
  })
  async create(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() createAlbumDto: CreateAlbumDto,
  ) {
    this.customLogger.logRequest(req);

    const result = await this.albumService.create(createAlbumDto);
    res.status(HttpStatus.CREATED);

    this.customLogger.logResponse(res);

    return result;
  }

  @Get()
  @ApiOkResponse({ description: 'OK', type: [Album] })
  async findAll(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    this.customLogger.logRequest(req);

    const result = await this.albumService.findAll();

    this.customLogger.logResponse(res);

    return result;
  }

  @Get(':id')
  @ApiOkResponse({ description: 'OK', type: Album })
  @ApiBadRequestResponse({ description: 'Invalid UUID' })
  @ApiNotFoundResponse({ description: 'Not found' })
  async findOne(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    this.customLogger.logRequest(req);

    const result = await this.albumService.findOne(id);

    this.customLogger.logResponse(res);

    return result;
  }

  @Put(':id')
  @ApiOkResponse({ description: 'OK', type: Album })
  @ApiBadRequestResponse({ description: 'Invalid UUID' })
  @ApiNotFoundResponse({ description: 'Not found' })
  async update(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ) {
    this.customLogger.logRequest(req);

    const result = await this.albumService.update(id, updateAlbumDto);

    this.customLogger.logResponse(res);

    return result;
  }

  @Delete(':id')
  @ApiNoContentResponse({ description: 'Deleted' })
  @ApiBadRequestResponse({ description: 'Invalid UUID' })
  @ApiNotFoundResponse({ description: 'Not found' })
  async remove(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    this.customLogger.logRequest(req);

    await this.albumService.remove(id);
    res.status(HttpStatus.NO_CONTENT);

    this.customLogger.logResponse(res);

    return '';
  }
}
