import { IPaginationOptions, Page, paginate } from 'src/pagination';
import { Repository, EntityRepository } from 'typeorm';
import { User } from './entities/user.entity';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  findOneByUsername(username: string) {
    return this.findOne({ username: username }, { withDeleted: true });
  }

  findAndPaginate(params: IPaginationOptions): Promise<Page<User>> {
    return paginate<User>(this, params);
  }
}
