import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @HttpCode(200)
  @Post()
  @UseInterceptors(FileInterceptor('media'))
  async uploadMediaFile(
    @UploadedFile() mediaFile: Express.Multer.File,
    @Query('folder') folder?: string,
  ) {
    return this.mediaService.saveMedia(mediaFile, folder);
  }
}