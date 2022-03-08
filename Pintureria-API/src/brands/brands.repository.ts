import { IPaginationOptions, Page, paginate } from 'src/pagination';
import { Repository, EntityRepository } from 'typeorm';
import { Brand } from './entities/brand.entity';

@EntityRepository(Brand)
export class BrandsRepository extends Repository<Brand> {
  findByName(name: string): Promise<Brand> {
    return this.findOne({ name: name }, { withDeleted: true });
  }

  findAndPaginate(params: IPaginationOptions): Promise<Page<Brand>> {
    return paginate<Brand>(this, params);
  }
}
