import { Repository, EntityRepository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@EntityRepository(User)
export class AuthRepository extends Repository<User> {
  findOneByUsername(username: string) {
    return this.findOne({ username: username });
  }
}
