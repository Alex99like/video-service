import { Body, Controller, Get, HttpCode, Param, Patch, Put, UsePipes, ValidationPipe } from "@nestjs/common";
import { UserService } from './user.service';
import { Auth } from "../auth/decorators/auth.decorator";
import { CurrentUser } from "./user.decorator";
import { UserDto } from "./user.dto";

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @Auth()
  findOne(@CurrentUser('id') id: number) {
    return this.userService.findOne(id)
  }

  @Get('by-id/:id')
  @Auth()
  findUser(@Param('id') id: string) {
    return this.userService.findOne(+id)
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Put(':id')
  @Auth()
  updateProfile(@Param('id') id: string, @Body() dto: UserDto) {
    return this.userService.updateProfile(+id, dto)
  }

  @HttpCode(200)
  @Patch('subscriber/:channelId')
  @Auth()
  subscribe(@CurrentUser('id') id: number, @Param('channelId') channelId: string) {
    return this.userService.subscribe(+id, +channelId)
  }

  @Get()
  findAll() {
    return this.userService.findAll()
  }
}