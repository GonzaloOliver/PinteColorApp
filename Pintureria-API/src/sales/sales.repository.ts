import { NotFoundException } from '@nestjs/common';
import { IPaginationOptions, Page, paginate } from 'src/pagination';
import { ProofType } from 'src/shared/enums';
import { Repository, EntityRepository, FindOneOptions } from 'typeorm';
import { Sale } from './entities/sale.entity';

@EntityRepository(Sale)
export class SalesRepository extends Repository<Sale> {
  findAndPaginate(params: IPaginationOptions, hide?: boolean): Promise<Page<Sale>> {
    return paginate<Sale>(this, params, hide);
  }

  async getSale(id: number, options?: FindOneOptions<Sale>): Promise<{ sale: Sale, remito: Sale }> {
    const sale = await this.findOne(id, options);

    if (!sale) throw new NotFoundException('La venta no existe')

    const remito = await this.findOne(sale.remito.id);

    return { sale: sale, remito: remito };
  }

  async getLastNumber(type: ProofType, posId: number): Promise<number> {
    const query = this.createQueryBuilder("sale")
      .select("MAX(sale.sale_number)", "max")
      .where("sale.pos_id = :posId", { posId: posId })
      .andWhere("type = :type", { type: type });
    const result = await query.getRawOne();
    return result.max;
  }
}
