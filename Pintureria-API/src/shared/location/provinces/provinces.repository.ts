import { Repository, EntityRepository } from 'typeorm';
import { Province } from './entities/province.entity';

@EntityRepository(Province)
export class ProvincesRepository extends Repository<Province> {}
