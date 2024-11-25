import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpStatus,
  Res,
  Put,
  ParseUUIDPipe,
  Inject,
  Req,
} from '@nestjs/common';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Request, Response } from 'express';

import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Artist } from './entities/artist.entity';
import { CustomLogger } from 'src/common/custom-logger/custom-logger.service';

@ApiTags('Artist')
@Controller('artist')
export class ArtistController {
  constructor(
    private readonly artistService: ArtistService,
    @Inject(CustomLogger)
    private customLogger: CustomLogger,
  ) {
    this.customLogger.setContext(ArtistController.name);
  }

  @Post()
  @ApiCreatedResponse({ description: 'Created', type: Artist })
  @ApiBadRequestResponse({
    description: 'Request body does not contain required fields',
  })
  async create(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() createArtistDto: CreateArtistDto,
  ) {
    res.status(HttpStatus.CREATED);

    this.customLogger.logRequest(req);

    const result = await this.artistService.create(createArtistDto);

    this.customLogger.logResponse(res);

    return result;
  }

  @Get()
  @ApiOkResponse({ description: 'OK', type: [Artist] })
  async findAll(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    this.customLogger.logRequest(req);

    const result = await this.artistService.findAll();
    this.customLogger.logResponse(res);

    return result;
  }

  @Get(':id')
  @ApiOkResponse({ description: 'OK', type: Artist })
  @ApiBadRequestResponse({ description: 'Invalid UUID' })
  @ApiNotFoundResponse({ description: 'Not found' })
  async findOne(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    this.customLogger.logRequest(req);

    const result = await this.artistService.findOne(id);

    this.customLogger.logResponse(res);

    return result;
  }

  @Put(':id')
  @ApiOkResponse({ description: 'OK', type: Artist })
  @ApiBadRequestResponse({ description: 'Invalid UUID' })
  @ApiNotFoundResponse({ description: 'Not found' })
  async update(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateArtistDto: UpdateArtistDto,
  ) {
    this.customLogger.logRequest(req);

    const result = await this.artistService.update(id, updateArtistDto);

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

    await this.artistService.remove(id);
    res.status(HttpStatus.NO_CONTENT);

    this.customLogger.logResponse(res);

    return '';
  }
}
