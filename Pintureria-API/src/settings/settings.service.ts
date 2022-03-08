import { Injectable, NotFoundException } from '@nestjs/common';
import { AppRoles, rolesPermissions } from 'src/app.roles';
import { ReadCompanyInfo, UpdateCompanyInfoDto } from './dto';
import { Setting } from './entities/setting.entity';
import { SettingsRepository } from './settings.repository';

@Injectable()
export class SettingsService {
  constructor(private readonly settingsRepository: SettingsRepository) {}

  async updateCompanyInfo(updateCompanyInfo: UpdateCompanyInfoDto) {
    for (const key in updateCompanyInfo) {
      const dbKey = await this.settingsRepository.findOne(key);
      dbKey.value = updateCompanyInfo[key];
      await this.settingsRepository.save(dbKey);
    }

    return 'Datos actualizados correctamente.';
  }

  async updateS() {
    const key = 's';
    const dbKey = await this.settingsRepository.findOne(key);
    var newValue = 'false';
    if (dbKey.value == 'true') newValue = 'false';
    if (dbKey.value == 'false') newValue = 'true';
    dbKey.value = newValue;
    return await this.settingsRepository.save(dbKey);
  }
  
  async findS() {
    const key = 's';
    const dbKey = await this.settingsRepository.findOne(key);
    return await dbKey;
  }
  
  async getCompanyInfo() {
    const companyInfo = new ReadCompanyInfo();

    for (const key in companyInfo) {
      companyInfo[key] = await (await this.settingsRepository.findOne(key)).value;
    }

    return companyInfo;
  }

  async getRolePermissions(userRoles: string[]) {
    const role = AppRoles[userRoles[0]];

    const roleExists = role in AppRoles;
    if (!roleExists) throw new NotFoundException('El rol no existe');

    const rolePermissions = rolesPermissions.find((element) => element.role == role);

    return rolePermissions;
  }

  async initDB() {
    if ((await this.settingsRepository.count()) == 0) {
      const companyInfo = new ReadCompanyInfo();
      for (const key in companyInfo) {
        const setting = new Setting();
        setting.key = key;
        setting.value = '';
        await this.settingsRepository.save(setting);
      }

      //Show
      const setting = new Setting();
      setting.key = 's';
      setting.value = 'true';
      await this.settingsRepository.save(setting);
    }
  }

  getMeasure() {
    return [
      { name: 'Unidad', value: 'UNIT' },
      { name: 'm2', value: 'M2' },
      { name: 'Litro', value: 'LITER' },
    ];
  }

  getIva() {
    return [
      { name: 'Responsable Inscripto', value: 'ResponsableInscripto' },
      { name: 'Responsable Monotributo', value: 'ResponsableMonotributo' },
      { name: 'Exento', value: 'SujetoExento' },
    ];
  }

  getRoles() {
    return [
      { name: 'Administrador', value: 'ADMIN' },
      { name: 'Operador', value: 'OPERATOR' },
    ];
  }

  getIdTypes() {
    return [
      { name: 'DU', value: 'DU' },
      { name: 'CUIL', value: 'CUIL' },
      { name: 'CUIT', value: 'CUIT' },
    ];
  }

  getAliquots() {
    return [
      { name: '0%', value: 'A0' },
      { name: '10,5%', value: 'A10_5' },
      { name: '21%', value: 'A21' },
      { name: '27%', value: 'A27' },
    ];
  }

  async getS() {
    const key = 's';
    const dbKey = await this.settingsRepository.findOne(key);
    return dbKey.value === 'true' ? true : false;
  }

  async getProofTypes() {
    const dbKey = await this.getS();

    if (dbKey) {
      return [
        { name: 'Factura A', value: 'FacturaA' },
        { name: 'Nota Debito A', value: 'NotaDebitoA' },
        { name: 'Nota Credito A', value: 'NotaCreditoA' },
        { name: 'Factura B', value: 'FacturaB' },
        { name: 'Nota Debito B', value: 'NotaDebitoB' },
        { name: 'Nota Credito B', value: 'NotaCreditoB' },
        { name: 'Remito', value: 'Remito' },
        { name: 'Factura X', value: 'FacturaX' },
        { name: 'Nota Debito X', value: 'NotaDebitoX' },
        { name: 'Nota Credito X', value: 'NotaCreditoX' },
        { name: 'Recibo', value: 'Recibo' },
        { name: 'Recibo X', value: 'ReciboX' },
        { name: 'Presupuesto', value: 'Presupuesto' },
      ];
    } else {
      return [
        { name: 'Factura A', value: 'FacturaA' },
        { name: 'Nota Debito A', value: 'NotaDebitoA' },
        { name: 'Nota Credito A', value: 'NotaCreditoA' },
        { name: 'Remito A', value: 'RemitoA' },
        { name: 'Factura B', value: 'FacturaB' },
        { name: 'Nota Debito B', value: 'NotaDebitoB' },
        { name: 'Nota Credito B', value: 'NotaCreditoB' },
        { name: 'Remito B', value: 'RemitoB' },
        { name: 'Recibo', value: 'Recibo' },
        { name: 'Presupuesto', value: 'Presupuesto' },
      ];
    }
  }
}
