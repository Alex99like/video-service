import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CommentService } from './comment.service';
import { CurrentUser } from '../user/user.decorator';
import { CommentDto } from './comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post()
  @Auth()
  async createComment(@CurrentUser('id') id: string, @Body() dto: CommentDto) {
    return this.commentService.create(+id, dto);
  }

  @HttpCode(200)
  @Delete(':id')
  @Auth()
  async deleteComment(@Param('id') id: string) {
    return this.commentService.deleteComment(+id);
  }
}