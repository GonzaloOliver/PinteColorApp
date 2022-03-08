import { IPaginationOptions, Page, paginate } from 'src/pagination';
import { Repository, EntityRepository } from 'typeorm';
import { Line } from './entities/line.entity';

@EntityRepository(Line)
export class LinesRepository extends Repository<Line> {
  findByName(name: string): Promise<Line> {
    return this.findOne({ name: name }, { withDeleted: true });
  }

  findAndPaginate(params: IPaginationOptions): Promise<Page<Line>> {
    return paginate<Line>(this, params);
  }
}
