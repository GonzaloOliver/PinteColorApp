export interface IJwtPayload {
  id: number;
  roles: string[];
  iat?: Date;
  exp?: Date;
}
