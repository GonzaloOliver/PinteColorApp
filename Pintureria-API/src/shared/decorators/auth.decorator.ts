import { applyDecorators, UseGuards } from '@nestjs/common';
import { ACGuard, UseRoles } from 'nest-access-control';
import { AuthGuard } from '@nestjs/passport';
import { RoleActions, RolePossessions, AppResources } from '../../app.roles';
import { User } from '../../users/entities/user.entity';
import { roles } from '../../app.roles';

export function Auth(resource: AppResources, action: RoleActions, possesion: RolePossessions) {
  const role = {
    resource: resource,
    action: action,
    possession: possesion,
  };
  return applyDecorators(UseGuards(AuthGuard(), ACGuard), UseRoles(role));
}

export const canRole = (
  reqUser: User,
  resource: AppResources,
  idResource: number | string,
  compareTo: number | string,
): boolean => {
  const canAny = roles.can(reqUser.roles).readAny(resource).granted;

  const canOwn = roles.can(reqUser.roles).readOwn(resource).granted;

  const isOwn = compareTo === +idResource;

  const permission = isOwn ? (canOwn ? true : false) : canAny ? true : false;

  return permission;
};
