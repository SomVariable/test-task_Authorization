import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { FindUserProfileDto } from './dto/find-user-profile.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("users-profile")
@Controller('user-profile')
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  // @Post()
  // create(@Body() createProfileData: CreateUserProfileDto) {
  //   return this.userProfileService.create(createProfileData);
  // }


  // @Get(':id')
  // findOne(@Param(ParseIntPipe) {userId}: FindUserProfileDto) {
  //   return this.userProfileService.findOne(userId);
  // }

  // @Patch(':id')
  // update(@Param(ParseIntPipe) id: number, @Body() updateUserProfileData: UpdateUserProfileDto) {
  //   return this.userProfileService.update(id, updateUserProfileData);
  // }

}
