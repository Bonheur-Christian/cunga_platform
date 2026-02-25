import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'generated/prisma/enums';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { InviteUserDTO } from './dto/invite-user.dto';
import { UpdateUserProfileDTO } from './dto/update-userprofile.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //create user

  // @ApiOperation({ summary: 'User registration' })
  // @Post('/signup')
  // async createUser(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.createUser(createUserDto);
  // }

  //invite user (SHOP_KEEPER or STOCK_MANAGER)
  @ApiOperation({ summary: 'Invite a new user (SHOP_KEEPER or STOCK_MANAGER)' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER)
  @Post('/invite')
  async inviteUser(@Body() inviteUserDto: InviteUserDTO) {
    return this.usersService.inviteUser(inviteUserDto);
  }

  //get all users
  @ApiOperation({ summary: 'Get all system users only by OWNER' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER)
  @Get('/all')
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }

  //get user by id
  @ApiOperation({ summary: 'Get a user by its ID' })
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  //Update user profile data
  @ApiOperation({ summary: 'Update user profile data' })
  @Patch('/update/profile/:id')
  async updateUserProfile(
    @Param('id') id: string,
    @Body() updateUserProfileDto: UpdateUserProfileDTO,
  ) {
    return this.usersService.updateUserProfile(id, updateUserProfileDto);
  }

  //update user by id
  @ApiOperation({ summary: 'Update a user by its ID (OWNER only)' })
  @Roles(Role.OWNER)
  @Patch('/update/:id')
  async updateUserById(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDTO,
  ) {
    return this.usersService.updateUserById(id, updateUserDto);
  }

  //delete user by id
  @ApiOperation({ summary: 'Delete a user by its ID only by OWNER' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER)
  @Delete('/delete/:id')
  async deleteUserById(@Param('id') id: string) {
    return this.usersService.deleteUserById(id);
  }
}
