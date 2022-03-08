import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePricelistDto } from './dto/create-pricelist.dto';
import { UpdatePricelistDto } from './dto/update-pricelist.dto';
import { PriceListRepository } from './pricelist.repository';
import { PriceList } from './entities/pricelist.entity';
import { IPaginationOptions, Page } from 'src/pagination';
import { getFilters } from 'src/pagination/getFilters';
import { ResponseDto } from 'src/shared/dto/response.dto';
@Injectable()
export class PricelistService {
  constructor(private readonly priceListRepository: PriceListRepository) { }

  async exists(id: number): Promise<PriceList> {
    const pricelistExists = await this.priceListRepository.findOne(id);

    if (!pricelistExists) throw new NotFoundException('La Lista de Precio no existe');

    return pricelistExists;
  }

  async existsByName(name: string, id?: number): Promise<void> {
    const pricelistExists = await this.priceListRepository.findByName(name);

    if (pricelistExists && pricelistExists.id != id)
      throw new ConflictException('Ya existe una lista de precio con el nombre ingresado');
  }

  async create(createPricelistDto: CreatePricelistDto): Promise<PriceList> {
    await this.existsByName(createPricelistDto.name);

    const pricelist = new PriceList(createPricelistDto);

    return await this.priceListRepository.save(pricelist);
  }

  async findAndPaginate(params: IPaginationOptions): Promise<Page<PriceList>> {
    return this.priceListRepository.findAndPaginate(params);
  }

  async findAll(params: IPaginationOptions): Promise<PriceList[]> {
    const searchOptions = await getFilters<PriceList>(params);
    return await this.priceListRepository.find({ ...searchOptions });
  }

  async findOne(id: number): Promise<PriceList> {
    const pricelist = await this.exists(id);
    return pricelist;
  }

  async update(id: number, updatePricelistDto: UpdatePricelistDto): Promise<PriceList> {
    await this.exists(id);

    await this.existsByName(updatePricelistDto.name, id);

    const wasModified = await this.priceListRepository.update(id, updatePricelistDto);

    if (!wasModified)
      throw new InternalServerErrorException('Ocurrió un error al intentar modificar la lista de precio');

    return await this.findOne(id);
  }

  async remove(id: number): Promise<ResponseDto> {
    await this.exists(id);

    const wasDeleted = await this.priceListRepository.softDelete(id);

    if (!wasDeleted) throw new InternalServerErrorException('Ocurrió un error al intentar borrar la lista de precio');

    return { statusCode: 202, message: 'Lista de Precio borrada' };
  }

  async initDB() {
    if ((await this.priceListRepository.count()) == 0) {
      const pricelist = new PriceList();
      pricelist.name = 'General';
      pricelist.value = 0;

      await this.priceListRepository.save(pricelist);
    }
  }
}
