import { IdType } from 'src/shared/enums';
import { Repository, EntityRepository } from 'typeorm';
import { Customer } from './entities/customer.entity';

@EntityRepository(Customer)
export class CustomersRepository extends Repository<Customer> {
  findByIdNumber(idNumber: string, idType: IdType) {
    return this.findOne({ idNumber: idNumber, idType: idType });
    //return this.createQueryBuilder('customers').where(`id_number = ${idNumber} AND id_type = ${idType}`).getOne();
  }
}
