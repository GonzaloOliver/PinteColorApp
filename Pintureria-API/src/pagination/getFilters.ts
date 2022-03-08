import { FindConditions, FindManyOptions, ILike } from 'typeorm';
import { IPaginationOptions } from '.';

export async function getFilters<T>(options: IPaginationOptions) {
  //If we receive just one order option, convert into string[] for correct foreach work
  if (typeof options.order === 'string') {
    options.order = [options.order];
  }

  //If we receive just one order option, convert into string[] for correct foreach work
  if (typeof options.where === 'string') {
    options.where = [options.where];
  }

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
    if (!receivedWhere) return '';

    const where = [];

    receivedWhere.forEach((element) => {
      const where2 = {};
      const [key, value] = element.split(':');
      if (key.includes('.')) {
        const subwhere = key.split('.');
        where2[subwhere[0]] = {};
        where2[subwhere[0]][subwhere[1]] = +value;
      } else {
        if (key.includes('date')) {
          where2[key] = value;
        } else {
          where2[key] = ILike(`%${value}%`);
        }
      }
      where.push(where2);
    });

    return where;
  }

  const searchOption: FindConditions<T> | FindManyOptions<T> = {
    where: getWhere(options.where),
    order: getOrder(options.order),
  };

  return searchOption;
}
