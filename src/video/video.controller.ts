import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { VideoService } from './video.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentUser } from '../user/user.decorator';
import { VideoDto } from './video.dto';

@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Get('get-private/:id')
  @Auth()
  async getVideoPrivate(@Param('id') id: string) {
    return this.videoService.byId(+id);
  }

  @Get()
  async getAll(@Query('searchTerm') searchTerm?: string) {
    return this.videoService.getAll(searchTerm);
  }

  @Get('most-popular')
  async getMostPopularByViews() {
    return this.videoService.getMostPopularByViews();
  }

  @Get(':id')
  async getVideo(@Param('id') id: string) {
    return this.videoService.byId(+id);
  }

  @HttpCode(200)
  @Post()
  @Auth()
  async postVideo(@CurrentUser('id') id: number) {
    return this.videoService.createVideo(id);
  }

  @HttpCode(200)
  @Put(':id')
  @Auth()
  async updateVideo(@Param('id') id: string, @Body() dto: VideoDto) {
    return this.videoService.updateVideo(+id, dto);
  }

  @HttpCode(200)
  @Delete(':id')
  @Auth()
  async deleteVideo(@Param('id') id: string) {
    return this.videoService.deleteVideo(+id);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Put('update-views/:videoId')
  async updateViews(@Param('videoId') videoId: string) {
    return this.videoService.updateCountViews(+videoId);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Put('update-likes/:videoId')
  async updateLikes(@Param('videoId') videoId: string) {
    return this.videoService.updateLikes(+videoId);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Put('update-dislikes/:videoId')
  async updateDislikes(@Param('videoId') videoId: string) {
    return this.videoService.updateDislikes(+videoId);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Delete('delete-likes/:videoId')
  async deleteLikes(@Param('videoId') videoId: string) {
    return this.videoService.deleteLikes(+videoId);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Delete('delete-dislikes/:videoId')
  async deleteDislikes(@Param('videoId') videoId: string) {
    return this.videoService.deleteDislikes(+videoId);
  }
}
