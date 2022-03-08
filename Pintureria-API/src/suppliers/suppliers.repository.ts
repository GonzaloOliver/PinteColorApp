import { IPaginationOptions, Page, paginate } from 'src/pagination';
import { Repository, EntityRepository } from 'typeorm';
import { Supplier } from './entities/supplier.entity';

@EntityRepository(Supplier)
export class SuppliersRepository extends Repository<Supplier> {
  async findOneByCuit(cuit: string) {
    return await this.findOne({ cuit: cuit }, { withDeleted: true });
  }

  async findOneByCode(code: string) {
    return await this.findOne({ code: code }, { withDeleted: true });
  }

  async findAndPaginate(params: IPaginationOptions): Promise<Page<Supplier>> {
    return paginate<Supplier>(this, params);
  }
}
