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
} from '@nestjs/common';
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Response } from 'express';

import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Track } from './entities/track.entity';

@ApiBearerAuth()
@ApiTags('Track')
@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Post()
  @ApiCreatedResponse({ description: 'Created', type: Track })
  @ApiBadRequestResponse({
    description: 'Request body does not contain required fields',
  })
  async create(
    @Res({ passthrough: true }) res: Response,
    @Body() createTrackDto: CreateTrackDto,
  ) {
    const result = await this.trackService.create(createTrackDto);
    res.status(HttpStatus.CREATED);

    return result;
  }

  @Get()
  @ApiOkResponse({ description: 'OK', type: [Track] })
  async findAll() {
    return await this.trackService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ description: 'OK', type: Track })
  @ApiBadRequestResponse({ description: 'Invalid UUID' })
  @ApiNotFoundResponse({ description: 'Not found' })
  async findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return await this.trackService.findOne(id);
  }

  @Put(':id')
  @ApiOkResponse({ description: 'OK', type: Track })
  @ApiBadRequestResponse({ description: 'Invalid UUID' })
  @ApiNotFoundResponse({ description: 'Not found' })
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ) {
    return await this.trackService.update(id, updateTrackDto);
  }

  @Delete(':id')
  @ApiNoContentResponse({ description: 'Deleted' })
  @ApiBadRequestResponse({ description: 'Invalid UUID' })
  @ApiNotFoundResponse({ description: 'Not found' })
  async remove(
    @Res({ passthrough: true }) res: Response,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    await this.trackService.remove(id);
    res.status(HttpStatus.NO_CONTENT);

    return '';
  }
}
