import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CommentDto {
  @IsNotEmpty()
  @IsString()
  message: string;

  @IsNumber()
  videoId: number;
}