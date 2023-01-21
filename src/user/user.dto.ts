import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class UserDto {
  @IsEmail()
  email: string;

  @IsString()
  password?: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  avatarPath: string;

  @IsBoolean()
  isVerified: boolean;

  @IsNumber()
  subscribersCount: number;
}