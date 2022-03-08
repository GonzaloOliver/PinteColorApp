import { InternalServerErrorException } from '@nestjs/common';
import { serialize } from 'class-transformer';
import { ProofType } from 'src/shared/enums';
import { Repository, FindConditions, FindManyOptions, ILike, MoreThanOrEqual, LessThanOrEqual, Between } from 'typeorm';
import { IPaginationOptions } from './interfaces/options.interface';
import { Page } from './interfaces/page.interface';

export async function paginate<T>(repository: Repository<T>, options: IPaginationOptions, show: boolean = true) {
  const defaultPage = 1;
  const defaultPerPage = 10;

  //If we receive just one order option, convert into string[] for correct foreach work
  if (typeof options.order === 'string') {
    options.order = [options.order];
  }

  //If we receive just one order option, convert into string[] for correct foreach work
  if (typeof options.where === 'string') {
    options.where = [options.where];
  }

  const page = options.page && options.page > 0 ? +options.page : defaultPage;

  const perPage = options.perPage && options.perPage > 0 ? +options.perPage : defaultPerPage;

  function getOrder(receivedOrder?: string[]) {
    if (!receivedOrder) return '';

    const order = {};

    receivedOrder.forEach((element) => {
      const split = element.split(':');
      order[split[0]] = split[1];
    });

    return order;
  }

  function getWhere(receivedWhere?: string[]) {
    const where = {};

    if (receivedWhere) {
      receivedWhere.forEach((element) => {
        const [key, value] = element.split(':');
        if (key.includes('.')) {
          const subwhere = key.split('.');
          where[subwhere[0]] = {};
          where[subwhere[0]][subwhere[1]] = +value;
        } else {
          if (key.includes('date')) {
            if (key == 'dateFrom') {
              where['date'] = MoreThanOrEqual(value);
            }
            else if (key == 'dateTo') {
              const dateTo = new Date(value);
              dateTo.setDate(dateTo.getDate() + 1);
              where['date'] = LessThanOrEqual(dateTo);
            }
            else if (key == 'dateBetween') {
              const subDate = value.split('.')
              const dateTo = new Date(subDate[1]);
              dateTo.setDate(dateTo.getDate() + 1);
              where['date'] = Between(subDate[0], dateTo.toISOString());
            }
            else {
              where[key] = value;
            }
          } else if (key == 'proofType') {
            where[key] = value;
          } else if (key == 'isDebt' || key == 'isRemitoUsed') {
            var newValue = false;
            if (value == 'true') newValue = true;
            where[key] = newValue;
          } else {
            where[key] = ILike(`%${value}%`);
          }
        }
      });
    }
    var ret;
    if (!show) {
      ret = [];
      where['proofType'] = ProofType.FacturaA;
      const i1 = { ...where };
      ret.push(i1);

      where['proofType'] = ProofType.FacturaB;
      const i2 = { ...where };
      ret.push(i2);

      where['proofType'] = ProofType.NotaCreditoA;
      const i3 = { ...where };
      ret.push(i3);

      where['proofType'] = ProofType.NotaCreditoB;
      const i4 = { ...where };
      ret.push(i4);

      where['proofType'] = ProofType.Presupuesto;
      const i5 = { ...where };
      ret.push(i5);

      where['proofType'] = ProofType.Recibo;
      const i6 = { ...where };
      ret.push(i6);

      where['proofType'] = ProofType.NotaDebitoA;
      const i7 = { ...where };
      ret.push(i7);

      where['proofType'] = ProofType.NotaDebitoB;
      const i8 = { ...where };
      ret.push(i8);
    }
    else {
      if (where) {
        ret = where;
      }
      else {
        ret = ''
      }
    }
    return ret;
  }

  const searchOption: FindConditions<T> | FindManyOptions<T> = {
    where: getWhere(options.where),
    order: getOrder(options.order),
  };

  const skip = (page - 1) * perPage;

  //Try to paginate with sort option, if the option given is incorrect return default pagination
  try {
    const [items, total] = await repository.findAndCount({ skip: skip, take: perPage, ...searchOption });

    const result: Page<T> = {
      content: JSON.parse(serialize(items)),
      meta: {
        itemCount: items.length,
        totalItems: total,
        itemsPerPage: perPage,
        totalPages: Math.ceil(total / perPage),
        currentPage: total != 0 ? page : 0,
      },
    };
    return result;
  } catch (error) {
    throw new InternalServerErrorException(`Error al obtener los resultados: ${error}`);
  }
}
