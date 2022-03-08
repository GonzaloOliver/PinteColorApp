import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ResponseDto } from 'src/shared/dto/response.dto';
import { paginate, Page, IPaginationOptions } from 'src/pagination';
import { BrandsRepository } from './brands.repository';
import { CreateBrandDto, UpdateBrandDto } from './dto';
import { Brand } from './entities/brand.entity';
import { getFilters } from 'src/pagination/getFilters';

@Injectable()
export class BrandsService {
  constructor(private readonly brandsRepository: BrandsRepository) { }

  async exists(id: number): Promise<Brand> {
    const brandExists = await this.brandsRepository.findOne(id);

    if (!brandExists) throw new NotFoundException('La marca no existe');

    return brandExists;
  }

  async existsByName(name: string, id?: number): Promise<void> {
    const brandExists = await this.brandsRepository.findByName(name);

    if (brandExists && brandExists.id != id) throw new ConflictException('Ya existe una marca con el nombre ingresado');
  }

  async create(createBrandDto: CreateBrandDto): Promise<Brand> {
    await this.existsByName(createBrandDto.name);

    const brand = new Brand(createBrandDto);

    return await this.brandsRepository.save(brand);
  }

  async findAndPaginate(params: IPaginationOptions): Promise<Page<Brand>> {
    return this.brandsRepository.findAndPaginate(params);
  }

  async findAll(params: IPaginationOptions): Promise<Brand[]> {
    const searchOptions = await getFilters<Brand>(params);
    return await this.brandsRepository.find({ ...searchOptions });
  }

  async findOne(id: number): Promise<Brand> {
    const brand = await this.exists(id);
    return brand;
  }

  async update(id: number, updateBrandDto: UpdateBrandDto): Promise<Brand> {
    await this.exists(id);

    await this.existsByName(updateBrandDto.name, id);

    const wasModified = await this.brandsRepository.update(id, updateBrandDto);

    if (!wasModified) throw new InternalServerErrorException('Ocurrió un error al intentar modificar la marca');

    return await this.findOne(id);
  }

  async remove(id: number): Promise<ResponseDto> {
    const brand = await this.exists(id);

    if (await brand.hasGoods())
      throw new ConflictException('La marca no debe estar asociada a ningún artículo antes de borrarse');

    const wasDeleted = await this.brandsRepository.softDelete(id);

    if (!wasDeleted) throw new InternalServerErrorException('Ocurrió un error al intentar borrar la marca');

    return { statusCode: 200, message: 'Marca borrada' };
  }
}
