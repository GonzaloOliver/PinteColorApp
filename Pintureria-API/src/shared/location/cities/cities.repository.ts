import { Repository, EntityRepository } from 'typeorm';
import { City } from './entities/city.entity';

@EntityRepository(City)
export class CitiesRepository extends Repository<City> {}
