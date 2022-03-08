import { Injectable, NotFoundException } from '@nestjs/common';
import { City } from '../cities/entities/city.entity';
import { Province } from './entities/province.entity';
import { ProvincesRepository } from './provinces.repository';

@Injectable()
export class ProvincesService {
  constructor(private readonly provincesRepository: ProvincesRepository) {}

  async exists(id: number): Promise<Province> {
    const provinceExists = await this.provincesRepository.findOne(id);

    if (!provinceExists) throw new NotFoundException('La provincia no existe');

    return provinceExists;
  }

  async findAll(): Promise<Province[]> {
    return await this.provincesRepository.find();
  }

  async findOne(id: number): Promise<Province> {
    const province = await this.exists(id);

    return province;
  }

  async findCities(id: number): Promise<City[]> {
    const province = await this.exists(id);

    return (await province.cities).sort((a, b) => (a.name < b.name ? -1 : 1));
  }

  async initDB() {
    if ((await this.provincesRepository.count()) == 0) {
      this.provincesRepository.query("INSERT INTO provinces (id, name) VALUES (1, 'Buenos Aires')");
      this.provincesRepository.query("INSERT INTO provinces (id, name) VALUES (2, 'Capital Federal')");
      this.provincesRepository.query("INSERT INTO provinces (id, name) VALUES (3, 'Catamarca')");
      this.provincesRepository.query("INSERT INTO provinces (id, name) VALUES (4, 'Chaco')");
      this.provincesRepository.query("INSERT INTO provinces (id, name) VALUES (5, 'Chubut')");
      this.provincesRepository.query("INSERT INTO provinces (id, name) VALUES (6, 'Córdoba')");
      this.provincesRepository.query("INSERT INTO provinces (id, name) VALUES (7, 'Corrientes')");
      this.provincesRepository.query("INSERT INTO provinces (id, name) VALUES (8, 'Entre Ríos')");
      this.provincesRepository.query("INSERT INTO provinces (id, name) VALUES (9, 'Formosa')");
      this.provincesRepository.query("INSERT INTO provinces (id, name) VALUES (10, 'Jujuy')");
      this.provincesRepository.query("INSERT INTO provinces (id, name) VALUES (11, 'La Pampa')");
      this.provincesRepository.query("INSERT INTO provinces (id, name) VALUES (12, 'La Rioja')");
      this.provincesRepository.query("INSERT INTO provinces (id, name) VALUES (13, 'Mendoza')");
      this.provincesRepository.query("INSERT INTO provinces (id, name) VALUES (14, 'Misiones')");
      this.provincesRepository.query("INSERT INTO provinces (id, name) VALUES (15, 'Neuquén')");
      this.provincesRepository.query("INSERT INTO provinces (id, name) VALUES (16, 'Río Negro')");
      this.provincesRepository.query("INSERT INTO provinces (id, name) VALUES (17, 'Salta')");
      this.provincesRepository.query("INSERT INTO provinces (id, name) VALUES (18, 'San Juan')");
      this.provincesRepository.query("INSERT INTO provinces (id, name) VALUES (19, 'San Luis')");
      this.provincesRepository.query("INSERT INTO provinces (id, name) VALUES (20, 'Santa Cruz')");
      this.provincesRepository.query("INSERT INTO provinces (id, name) VALUES (21, 'Santa Fe')");
      this.provincesRepository.query("INSERT INTO provinces (id, name) VALUES (22, 'Santiago del Estero')");
      this.provincesRepository.query("INSERT INTO provinces (id, name) VALUES (23, 'Tierra del Fuego')");
      this.provincesRepository.query("INSERT INTO provinces (id, name) VALUES (24, 'Tucumán')");
    }
  }
}
