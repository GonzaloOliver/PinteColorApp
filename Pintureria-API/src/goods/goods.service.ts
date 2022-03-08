import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { StockService } from 'src/stock/stock.service';
import { ResponseDto } from 'src/shared/dto/response.dto';
import { CreateGoodDto, UpdateGoodDto } from './dto';
import { Good } from './entities/good.entity';
import { GoodsRepository } from './goods.repository';
import { SuppliersService } from 'src/suppliers/suppliers.service';
import { BrandsService } from 'src/brands/brands.service';
import { LinesService } from 'src/lines/lines.service';
import { IPaginationOptions, Page } from 'src/pagination';
import { getFilters } from 'src/pagination/getFilters';
import { ILike } from 'typeorm';

@Injectable()
export class GoodsService {
  constructor(
    private readonly goodsRepository: GoodsRepository,
    @Inject(forwardRef(() => StockService))
    private readonly stockService: StockService,
    private readonly suppliersService: SuppliersService,
    private readonly brandsService: BrandsService,
    private readonly linesService: LinesService,
  ) { }

  async exists(id: number): Promise<Good> {
    const goodExists = await this.goodsRepository.findOne(id);

    if (!goodExists) throw new NotFoundException('El artículo no existe');

    return goodExists;
  }

  async existsByCode(code: string, idGood?: number): Promise<void> {
    const goodExists = await this.goodsRepository.findOneByCode(code);

    if (goodExists && goodExists.id != idGood)
      throw new ConflictException('Ya existe un artículo con el código ingresado');
  }

  async create(createGoodDto: CreateGoodDto): Promise<Good> {
    const good = new Good(createGoodDto);

    good.brand = await this.brandsService.exists(createGoodDto.brand.id);

    good.line = await this.linesService.exists(createGoodDto.line.id);

    good.supplier = await this.suppliersService.exists(createGoodDto.supplier.id);

    const goodCode = createGoodDto.code.toUpperCase();

    //Verify if supplier's code match with supplier's stored code
    await this.suppliersService.verifyCode(goodCode.substr(0, 3), createGoodDto.supplier.id);

    await this.existsByCode(goodCode);
    good.code = goodCode;

    const stocks = await this.stockService.initFromGood(good);

    good.stocks = stocks;

    return await this.goodsRepository.save(good);
  }

  async findAll(): Promise<Good[]> {
    return this.goodsRepository.find();
  }

  async findAllWithFilters(params: IPaginationOptions): Promise<Good[]> {
    const searchOptions = await getFilters<Good>(params);
    return await this.goodsRepository.find({ ...searchOptions });
  }

  async findAndPaginate(params: IPaginationOptions): Promise<Page<Good>> {
    return await this.goodsRepository.findAndPaginate(params);
  }

  async findOne(id: number): Promise<Good> {
    const good = await this.exists(id);
    return good;
  }

  async findByName(name: string): Promise<Good[]> {
    const goods = await this.goodsRepository.find({ name: ILike(`%${name}%`) });
    return goods;
  }

  async findByCode(code: string): Promise<Good[]> {
    const goods = await this.goodsRepository.find({ code: ILike(`%${code}%`) });
    return goods;
  }

  async update(id: number, updateGoodDto: UpdateGoodDto): Promise<Good> {
    let good = await this.exists(id);

    if (updateGoodDto.brand) {
      good.brand = await this.brandsService.exists(updateGoodDto.brand.id);
    }

    if (updateGoodDto.line) {
      good.line = await this.linesService.exists(updateGoodDto.line.id);
    }

    if (updateGoodDto.supplier) {
      good.supplier = await this.suppliersService.exists(updateGoodDto.supplier.id);
    }

    if (updateGoodDto.code) {
      const goodCode = updateGoodDto.code.toUpperCase();

      //Verify if supplier's code match with supplier's stored code
      await this.suppliersService.verifyCode(goodCode.substr(0, 3), good.supplier.id);

      await this.existsByCode(goodCode, id);
      good.code = goodCode;
    }

    const updatedGood = new Good(updateGoodDto);
    good = updatedGood;

    await this.goodsRepository.update(id, good).catch((error) => {
      throw new InternalServerErrorException(`Ocurrió un error al intentar editar el artículo: ${error}`);
    });

    return await this.findOne(id);
  }

  async remove(id: number): Promise<ResponseDto> {
    const good = await this.goodsRepository.findOne(id, {
      relations: ['stocks'],
    });

    if (!good) throw new NotFoundException('El artículo no existe.');

    await this.goodsRepository.softRemove(good).catch((error) => {
      throw new InternalServerErrorException('Ocurrió un error al intentar borrar el artículo.');
    });

    return { statusCode: 200, message: 'Artículo borrado' };
  }
}
