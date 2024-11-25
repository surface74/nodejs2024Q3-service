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
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Request, Response } from 'express';

import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Track } from './entities/track.entity';
import { CustomLogger } from 'src/common/custom-logger/custom-logger.service';

@ApiTags('Track')
@Controller('track')
export class TrackController {
  constructor(
    private readonly trackService: TrackService,
    @Inject(CustomLogger)
    private customLogger: CustomLogger,
  ) {
    this.customLogger.setContext(TrackController.name);
  }

  @Post()
  @ApiCreatedResponse({ description: 'Created', type: Track })
  @ApiBadRequestResponse({
    description: 'Request body does not contain required fields',
  })
  async create(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() createTrackDto: CreateTrackDto,
  ) {
    this.customLogger.logRequest(req);

    const result = await this.trackService.create(createTrackDto);
    res.status(HttpStatus.CREATED);

    this.customLogger.logResponse(res);

    return result;
  }

  @Get()
  @ApiOkResponse({ description: 'OK', type: [Track] })
  async findAll(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    this.customLogger.logRequest(req);

    const result = await this.trackService.findAll();

    this.customLogger.logResponse(res);

    return result;
  }

  @Get(':id')
  @ApiOkResponse({ description: 'OK', type: Track })
  @ApiBadRequestResponse({ description: 'Invalid UUID' })
  @ApiNotFoundResponse({ description: 'Not found' })
  async findOne(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    this.customLogger.logRequest(req);

    const result = await this.trackService.findOne(id);

    this.customLogger.logResponse(res);

    return result;
  }

  @Put(':id')
  @ApiOkResponse({ description: 'OK', type: Track })
  @ApiBadRequestResponse({ description: 'Invalid UUID' })
  @ApiNotFoundResponse({ description: 'Not found' })
  async update(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ) {
    this.customLogger.logRequest(req);

    const result = await this.trackService.update(id, updateTrackDto);

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

    await this.trackService.remove(id);
    res.status(HttpStatus.NO_CONTENT);

    this.customLogger.logResponse(res);

    return '';
  }
}
