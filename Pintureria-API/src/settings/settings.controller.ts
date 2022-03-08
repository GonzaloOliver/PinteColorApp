import { Body, Controller, Get, Param, Patch, Put, Query } from '@nestjs/common';
import { AppResources, RoleActions, RolePossessions } from 'src/app.roles';
import { Auth } from 'src/shared/decorators/auth.decorator';
import { ReqUser } from 'src/shared/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { ReadCompanyInfo, UpdateCompanyInfoDto } from './dto';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) { }

  @Get('companyInfo')
  getCompanyInfo(): Promise<ReadCompanyInfo> {
    return this.settingsService.getCompanyInfo();
  }

  @Put('companyInfo')
  updateCompanyInfo(@Body() updateCompanyInfo: UpdateCompanyInfoDto) {
    return this.settingsService.updateCompanyInfo(updateCompanyInfo);
  }

  @Patch('s')
  async updateShow() {
    const res = await this.settingsService.updateS();
    if (res.value == 'true') return true;
    if (res.value == 'false') return false;
  }

  @Get('s')
  async getShow() {
    const res = await this.settingsService.findS();
    if (res.value == 'true') return true;
    if (res.value == 'false') return false;
  }

  @Auth(AppResources.SETTINGS, RoleActions.READ, RolePossessions.OWN)
  @Get('rolePermissions')
  getRolePermissions(@ReqUser() reqUser: User) {
    return this.settingsService.getRolePermissions(reqUser.roles);
  }

  @Get('measure')
  getMeasure() {
    return this.settingsService.getMeasure();
  }

  @Get('iva')
  getIva() {
    return this.settingsService.getIva();
  }

  @Get('aliquots')
  getAliquots() {
    return this.settingsService.getAliquots();
  }

  @Get('roles')
  getRoles() {
    return this.settingsService.getRoles();
  }

  @Get('idTypes')
  getIdTypes() {
    return this.settingsService.getIdTypes();
  }

  @Get('proofTypes')
  getProofTypes() {
    return this.settingsService.getProofTypes();
  }
}
