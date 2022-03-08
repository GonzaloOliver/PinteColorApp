import { Injectable, NotFoundException } from '@nestjs/common';
import { CitiesRepository } from './cities.repository';
import { City } from './entities/city.entity';

@Injectable()
export class CitiesService {
  constructor(private readonly citiesRepository: CitiesRepository) {}

  async exists(id: number): Promise<City> {
    const cityExists = await this.citiesRepository.findOne(id);

    if (!cityExists) throw new NotFoundException('La ciudad no existe');

    return cityExists;
  }

  async findOne(id: number): Promise<City> {
    return this.exists(id);
  }

  async initDB() {
    if ((await this.citiesRepository.count()) == 0) {
      this.citiesRepository.query(
        "INSERT INTO cities (name, zip_code, province_id) VALUES ('ARROYO ALGODON', '5909', 6)",
      );
      this.citiesRepository.query(
        "INSERT INTO cities (name, zip_code, province_id) VALUES ('ARROYO CABRAL', '5917', 6)",
      );
      this.citiesRepository.query("INSERT INTO cities (name, zip_code, province_id) VALUES ('AUSONIA', '5901', 6)");
      this.citiesRepository.query("INSERT INTO cities (name, zip_code, province_id) VALUES ('CHAZON', '2675', 6)");
      this.citiesRepository.query(
        "INSERT INTO cities (name, zip_code, province_id) VALUES ('COLONIA SILVIO PELLICO', '5907', 6)",
      );
      this.citiesRepository.query("INSERT INTO cities (name, zip_code, province_id) VALUES ('ETRURIA', '2681', 6)");
      this.citiesRepository.query("INSERT INTO cities (name, zip_code, province_id) VALUES ('LA LAGUNA', '5901', 6)");
      this.citiesRepository.query(
        "INSERT INTO cities (name, zip_code, province_id) VALUES ('LA PALESTINA', '5925', 6)",
      );
      this.citiesRepository.query("INSERT INTO cities (name, zip_code, province_id) VALUES ('LA PLAYOSA', '5911', 6)");
      this.citiesRepository.query("INSERT INTO cities (name, zip_code, province_id) VALUES ('LOS ZORROS', '5901', 6)");
      this.citiesRepository.query("INSERT INTO cities (name, zip_code, province_id) VALUES ('LUCA', '5917', 6)");
      this.citiesRepository.query("INSERT INTO cities (name, zip_code, province_id) VALUES ('PASCO', '5925', 6)");
      this.citiesRepository.query("INSERT INTO cities (name, zip_code, province_id) VALUES ('TICINO', '5927', 6)");
      this.citiesRepository.query("INSERT INTO cities (name, zip_code, province_id) VALUES ('TIO PUJIO', '5936', 6)");
      this.citiesRepository.query("INSERT INTO cities (name, zip_code, province_id) VALUES ('VILLA NUEVA', '5903', 6)");
      this.citiesRepository.query("INSERT INTO cities (name, zip_code, province_id) VALUES ('CHU', '5218', 6)");
      this.citiesRepository.query("INSERT INTO cities (name, zip_code, province_id) VALUES ('DEAN FUNES', '5200', 6)");
      this.citiesRepository.query("INSERT INTO cities (name, zip_code, province_id) VALUES ('MOGNA', '5409', '18')");
      this.citiesRepository.query("INSERT INTO cities (name, zip_code, province_id) VALUES ('QUILINO', '5214', 6)");
      this.citiesRepository.query(
        "INSERT INTO cities (name, zip_code, province_id) VALUES ('VILLA QUILINO', '5214', 6)",
      );
      this.citiesRepository.query(
        "INSERT INTO cities (name, zip_code, province_id) VALUES ('ALEJANDRO ROCA', '2686', 6)",
      );
      this.citiesRepository.query("INSERT INTO cities (name, zip_code, province_id) VALUES ('BENGOLEA', '5807', 6)");
      this.citiesRepository.query("INSERT INTO cities (name, zip_code, province_id) VALUES ('CARNERILLO', '5805', 6)");
      this.citiesRepository.query("INSERT INTO cities (name, zip_code, province_id) VALUES ('CHARRAS', '5807', 6)");
      this.citiesRepository.query(
        "INSERT INTO cities (name, zip_code, province_id) VALUES ('GENERAL CABRERA', '5809', 6)",
      );
      this.citiesRepository.query(
        "INSERT INTO cities (name, zip_code, province_id) VALUES ('GENERAL DEHEZA', '5923', 6)",
      );
      this.citiesRepository.query("INSERT INTO cities (name, zip_code, province_id) VALUES ('HUANCHILLA', '6121', 6)");
      this.citiesRepository.query("INSERT INTO cities (name, zip_code, province_id) VALUES ('LA CARLOTA', '2670', 6)");
      this.citiesRepository.query("INSERT INTO cities (name, zip_code, province_id) VALUES ('OLAETA', '5807', 6)");
      this.citiesRepository.query("INSERT INTO cities (name, zip_code, province_id) VALUES ('REDUCCION', '5803', 6)");
      this.citiesRepository.query(
        "INSERT INTO cities (name, zip_code, province_id) VALUES ('SANTA EUFEMIA', '2671', 6)",
      );
      this.citiesRepository.query("INSERT INTO cities (name, zip_code, province_id) VALUES ('UCACHA', '2677', 6)");
      this.citiesRepository.query("INSERT INTO cities (name, zip_code, province_id) VALUES ('CHUCUMA', '5447', '18')");
      this.citiesRepository.query(
        "INSERT INTO cities (name, zip_code, province_id) VALUES ('ALEJO LEDESMA', '2662', 6)",
      );
      this.citiesRepository.query("INSERT INTO cities (name, zip_code, province_id) VALUES ('ARIAS', '2624', 6)");
      this.citiesRepository.query(
        "INSERT INTO cities (name, zip_code, province_id) VALUES ('CAMILO ALDAO', '2585', 6)",
      );
      this.citiesRepository.query(
        "INSERT INTO cities (name, zip_code, province_id) VALUES ('CAP GRAL BERNARDO O HIGGINS', '2645', 6)",
      );
      this.citiesRepository.query("INSERT INTO cities (name, zip_code, province_id) VALUES ('CAVANAGH', '2625', 6)");
      this.citiesRepository.query(
        "INSERT INTO cities (name, zip_code, province_id) VALUES ('COLONIA ITALIANA', '2645', 6)",
      );
      this.citiesRepository.query(
        "INSERT INTO cities (name, zip_code, province_id) VALUES ('CORRAL DE BUSTOS', '2645', 6)",
      );
      this.citiesRepository.query("INSERT INTO cities (name, zip_code, province_id) VALUES ('CRUZ ALTA', '2189', 6)");
      this.citiesRepository.query(
        "INSERT INTO cities (name, zip_code, province_id) VALUES ('GENERAL BALDISSERA', '2583', 6)",
      );
      this.citiesRepository.query(
        "INSERT INTO cities (name, zip_code, province_id) VALUES ('GENERAL ROCA', '2592', 6)",
      );
      this.citiesRepository.query("INSERT INTO cities (name, zip_code, province_id) VALUES ('GUATIMOZIN', '2627', 6)");
      this.citiesRepository.query("INSERT INTO cities (name, zip_code, province_id) VALUES ('INRIVILLE', '2587', 6)");
      this.citiesRepository.query("INSERT INTO cities (name, zip_code, province_id) VALUES ('ISLA VERDE', '2661', 6)");
      this.citiesRepository.query("INSERT INTO cities (name, zip_code, province_id) VALUES ('LEONES', '2594', 6)");
      this.citiesRepository.query(
        "INSERT INTO cities (name, zip_code, province_id) VALUES ('LOS SURGENTES', '2581', 6)",
      );
      this.citiesRepository.query(
        "INSERT INTO cities (name, zip_code, province_id) VALUES ('MARCOS JUAREZ', '2580', 6)",
      );
      this.citiesRepository.query("INSERT INTO cities (name, zip_code, province_id) VALUES ('MONTE BUEY', '2589', 6)");
      this.citiesRepository.query("INSERT INTO cities (name, zip_code, province_id) VALUES ('SAIRA', '2525', 6)");
      this.citiesRepository.query("INSERT INTO cities (name, zip_code, province_id) VALUES ('SALADILLO', '2587', 6)");
      this.citiesRepository.query("INSERT INTO cities (name, zip_code, province_id) VALUES ('SAN CARLOS', '5291', 6)");
      this.citiesRepository.query("INSERT INTO cities (name, zip_code, province_id) VALUES ('SALSACATE', '5295', 6)");
      this.citiesRepository.query(
        "INSERT INTO cities (name, zip_code, province_id) VALUES ('GENERAL LEVALLE', '6132', 6)",
      );
      this.citiesRepository.query("INSERT INTO cities (name, zip_code, province_id) VALUES ('LA CESIRA', '6101', 6)");
      this.citiesRepository.query("INSERT INTO cities (name, zip_code, province_id) VALUES ('LABOULAYE', '6120', 6)");
      this.citiesRepository.query("INSERT INTO cities (name, zip_code, province_id) VALUES ('MELO', '6123', 6)");
      this.citiesRepository.query("INSERT INTO cities (name, zip_code, province_id) VALUES ('RIO BAMBA', '6134', 6)");
      this.citiesRepository.query("INSERT INTO cities (name, zip_code, province_id) VALUES ('ROSALES', '6128', 6)");
      this.citiesRepository.query("INSERT INTO cities (name, zip_code, province_id) VALUES ('SERRANO', '6125', 6)");
      this.citiesRepository.query("INSERT INTO cities (name, zip_code, province_id) VALUES ('VILLA ROSSI', '6128', 6)");
      this.citiesRepository.query(
        "INSERT INTO cities (name, zip_code, province_id) VALUES ('BIALET MASSE', '5158', 6)",
      );
      this.citiesRepository.query("INSERT INTO cities (name, zip_code, province_id) VALUES ('CABALANGO', '5155', 6)");
      this.citiesRepository.query(
        "INSERT INTO cities (name, zip_code, province_id) VALUES ('CAPILLA DEL MONTE', '5184', 6)",
      );
      this.citiesRepository.query("INSERT INTO cities (name, zip_code, province_id) VALUES ('CASA GRANDE', '5162', 6)");
      this.citiesRepository.query("INSERT INTO cities (name, zip_code, province_id) VALUES ('COSQUIN', '5166', 6)");
      this.citiesRepository.query("INSERT INTO cities (name, zip_code, province_id) VALUES ('CRUZ CHICA', '5178', 6)");
      this.citiesRepository.query(
        "INSERT INTO cities (name, zip_code, province_id) VALUES ('CUESTA BLANCA', '5153', 6)",
      );
    }
  }
}
