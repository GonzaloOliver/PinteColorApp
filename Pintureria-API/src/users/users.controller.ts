import { Controller, Get, Post, Body, Put, Param, Delete, UnauthorizedException, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { ChangeOwnPasswordDto, ChangePasswordDto, CreateUserDto, UpdateUserDto } from './dto';
import { AppResources, RoleActions, RolePossessions } from 'src/app.roles';
import { ReqUser } from 'src/shared/decorators/user.decorator';
import { User } from './entities/user.entity';
import { Auth, canRole } from 'src/shared/decorators/auth.decorator';
import { SetRoleDto } from './dto/set-role.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //Implementation of 'canRole' function for USER App Resource
  can(reqUser: User, idResource: number | string, compareTo: number | string) {
    const permission = canRole(reqUser, AppResources.USERS, idResource, compareTo);
    if (!permission) throw new UnauthorizedException();
  }

  @Auth(AppResources.USERS, RoleActions.CREATE, RolePossessions.ANY)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Auth(AppResources.USERS, RoleActions.READ, RolePossessions.ANY)
  @Get()
  findAndPaginate(@Query() params) {
    return this.usersService.findAndPaginate(params);
  }

  @Auth(AppResources.USERS, RoleActions.READ, RolePossessions.OWN)
  @Get('profile')
  getProfile(@ReqUser() reqUser: User) {
    return this.usersService.getProfile(reqUser.id);
  }

  @Auth(AppResources.USERS, RoleActions.UPDATE, RolePossessions.OWN)
  @Put('changePassword')
  changeOwnPassword(@ReqUser() reqUser: User, @Body() changeOwnPasswordDto: ChangeOwnPasswordDto) {
    return this.usersService.changeOwnPassword(reqUser.id, changeOwnPasswordDto);
  }

  @Auth(AppResources.USERS, RoleActions.READ, RolePossessions.ANY)
  @Get(':id')
  async findOne(@Param('id') id: string, @ReqUser() reqUser: User) {
    this.can(reqUser, id, reqUser.id);

    return this.usersService.findOne(+id);
  }

  @Auth(AppResources.USERS, RoleActions.UPDATE, RolePossessions.ANY)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @ReqUser() reqUser: User) {
    this.can(reqUser, id, reqUser.id);

    return this.usersService.update(+id, updateUserDto);
  }

  @Auth(AppResources.USERS, RoleActions.DELETE, RolePossessions.ANY)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Auth(AppResources.USERS, RoleActions.UPDATE, RolePossessions.ANY)
  @Put(':userId/setRole')
  async setRole(@Param('userId') userId: string, @Body() setRoleDto: SetRoleDto) {
    return await this.usersService.setRole(+userId, setRoleDto);
  }

  @Auth(AppResources.USERS, RoleActions.UPDATE, RolePossessions.ANY)
  @Put(':id/changePassword')
  changePassword(@Param('id') id: string, @Body() changePasswordDto: ChangePasswordDto, @ReqUser() reqUser: User) {
    this.can(reqUser, id, reqUser.id);

    return this.usersService.changePassword(+id, changePasswordDto);
  }
}
