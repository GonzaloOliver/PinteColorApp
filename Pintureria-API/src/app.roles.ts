import { RolesBuilder } from 'nest-access-control';

export enum RolePossessions {
  OWN = 'own',
  ANY = 'any',
}

export enum RoleActions {
  READ = 'read',
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
}

export enum AppRoles {
  ADMIN = 'ADMIN',
  OPERATOR = 'OPERATOR',
}

export enum AppResources {
  BRANDS = 'BRANDS',
  CUSTOMERS = 'CUSTOMERS',
  GOODS = 'GOODS',
  LINES = 'LINES',
  SALES = 'SALES',
  SECTORS = 'SECTORS',
  SETTINGS = 'SETTINGS',
  STOCK = 'STOCK',
  STORES = 'STORES',
  SUPPLIERS = 'SUPPLIERS',
  USERS = 'USERS',
  PRICELIST = 'PRICELIST',
}

export interface IPermission {
  resource: AppResources;
  grant: boolean;
}

export interface IRolePermission {
  role: AppRoles;
  permissions: IPermission[];
}

export function getRolePermissions(role: AppRoles) {
  const rolePermissions: IRolePermission = {
    role: role,
    permissions: [],
  };

  const rolesPermissions = roles.getGrants();

  const roleResources = Object.keys(rolesPermissions[role]);
  for (const resource in roleResources) {
    const newPermission: IPermission = {
      resource: AppResources[roleResources[resource]],
      grant: true,
    };
    rolePermissions.permissions.push(newPermission);
  }

  return rolePermissions;
}

export const rolesPermissions: IRolePermission[] = [
  {
    role: AppRoles.ADMIN,
    permissions: [
      { resource: AppResources.BRANDS, grant: true },
      { resource: AppResources.CUSTOMERS, grant: true },
      { resource: AppResources.GOODS, grant: true },
      { resource: AppResources.LINES, grant: true },
      { resource: AppResources.SALES, grant: true },
      { resource: AppResources.SECTORS, grant: true },
      { resource: AppResources.SETTINGS, grant: true },
      { resource: AppResources.STOCK, grant: true },
      { resource: AppResources.STORES, grant: true },
      { resource: AppResources.SUPPLIERS, grant: true },
      { resource: AppResources.CUSTOMERS, grant: true },
      { resource: AppResources.USERS, grant: true },
      { resource: AppResources.PRICELIST, grant: true },
    ],
  },
  {
    role: AppRoles.OPERATOR,
    permissions: [
      { resource: AppResources.BRANDS, grant: false },
      { resource: AppResources.CUSTOMERS, grant: false },
      { resource: AppResources.GOODS, grant: false },
      { resource: AppResources.LINES, grant: false },
      { resource: AppResources.SALES, grant: true },
      { resource: AppResources.SECTORS, grant: false },
      { resource: AppResources.SETTINGS, grant: false },
      { resource: AppResources.STOCK, grant: false },
      { resource: AppResources.STORES, grant: false },
      { resource: AppResources.SUPPLIERS, grant: false },
      { resource: AppResources.CUSTOMERS, grant: false },
      { resource: AppResources.USERS, grant: false },
      { resource: AppResources.PRICELIST, grant: false },
    ],
  },
];

export const roles: RolesBuilder = new RolesBuilder();
roles
  /// USER
  //ADMIN
  .grant(AppRoles.ADMIN)
  .createAny(AppResources.USERS)
  .deleteAny(AppResources.USERS)
  .readAny(AppResources.USERS)
  .updateAny(AppResources.USERS)
  //OPERATOR
  .grant(AppRoles.OPERATOR)
  .readOwn(AppResources.USERS)
  .updateOwn(AppResources.USERS)

  /// SETTINGS
  //ADMIN
  .grant(AppRoles.ADMIN)
  .readAny(AppResources.SETTINGS)
  .updateAny(AppResources.SETTINGS)
  //OPERATOR
  .grant(AppRoles.OPERATOR)
  .readOwn(AppResources.SETTINGS)
  /// STOCK
  //ADMIN
  .grant(AppRoles.ADMIN)
  .readAny(AppResources.STOCK)
  .updateAny(AppResources.STOCK);
