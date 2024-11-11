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
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Response } from 'express';
import { ErrorMessage } from 'src/storage/types/error-message.enum';
import { DbResult } from 'src/storage/types/result.types';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Album')
@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Post()
  @ApiCreatedResponse({ description: 'Created' })
  @ApiBadRequestResponse({
    description: 'Request body does not contain required fields',
  })
  async create(
    @Body() createAlbumDto: CreateAlbumDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.albumService.create(createAlbumDto);
    if (result.errorText) {
      res.status(HttpStatus.BAD_REQUEST);
      return result.errorText;
    }

    res.status(HttpStatus.CREATED);
    return result.data;
  }

  @Get()
  @ApiOkResponse({ description: 'OK' })
  async findAll() {
    return (await this.albumService.findAll()).data;
  }

  @Get(':id')
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Invalid UUID' })
  @ApiNotFoundResponse({ description: 'Not found' })
  async findOne(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result: DbResult = await this.albumService.findOne(id);
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
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Invalid UUID' })
  @ApiNotFoundResponse({ description: 'Not found' })
  async update(
    @Param('id') id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result: DbResult = await this.albumService.update(id, updateAlbumDto);

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

  @Delete(':id')
  @ApiNoContentResponse({ description: 'Deleted' })
  @ApiBadRequestResponse({ description: 'Invalid UUID' })
  @ApiNotFoundResponse({ description: 'Not found' })
  async remove(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await await this.albumService.remove(id);

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
    return '';
  }
}
