import { IPaginationOptions, Page, paginate } from 'src/pagination';
import { Repository, EntityRepository } from 'typeorm';
import { Sector } from './entities/sector.entity';

@EntityRepository(Sector)
export class SectorsRepository extends Repository<Sector> {
  findByName(name: string): Promise<Sector> {
    return this.findOne({ name: name });
  }

  findAndPaginate(params: IPaginationOptions): Promise<Page<Sector>> {
    return paginate<Sector>(this, params);
  }
}
