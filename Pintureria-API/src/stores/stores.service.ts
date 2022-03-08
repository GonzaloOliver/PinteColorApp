import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Store } from './entities/store.entity';
import { CreateStoreDto, UpdateStoreDto } from './dto';
import { StoresRepository } from './stores.repository';
import { ResponseDto } from 'src/shared/dto/response.dto';
import { StockService } from 'src/stock/stock.service';
import { CitiesService } from 'src/shared/location/cities/cities.service';
import { IPaginationOptions, Page } from 'src/pagination';
import { City } from 'src/shared/location/cities/entities/city.entity';

@Injectable()
export class StoresService {
  constructor(
    private readonly storesRepository: StoresRepository,
    @Inject(forwardRef(() => StockService))
    private readonly stockService: StockService,
    private readonly citiesService: CitiesService,
  ) { }

  async exists(id: number): Promise<Store> {
    const storeExists = await this.storesRepository.findOne(id);

    if (!storeExists) throw new NotFoundException('La sucursal no existe');

    return storeExists;
  }

  async existsByPosFiscalNumber(posFiscalNumber: string, id?: number): Promise<void> {
    const storeExists = await this.storesRepository.findOneByPosFiscalNumber(posFiscalNumber);

    if (storeExists && storeExists.id != id) throw new ConflictException('El número de punto de venta ya existe');
  }

  async create(createStoreDto: CreateStoreDto): Promise<Store> {
    const store = new Store();
    store.name = createStoreDto.name;
    store.address = createStoreDto.address;
    store.isPOS = createStoreDto.isPOS;
    store.city = await this.citiesService.exists(createStoreDto.city.id);
    store.phoneNumber = createStoreDto.phoneNumber;

    if (store.isPOS) {
      if (!createStoreDto.posFiscalNumber) throw new BadRequestException('Ingrese un número de punto de venta');

      await this.existsByPosFiscalNumber(createStoreDto.posFiscalNumber);

      store.posFiscalNumber = createStoreDto.posFiscalNumber;
    }

    const stocks = await this.stockService.initFromStore(store);

    store.stocks = stocks;

    return await this.storesRepository.save(store).catch((error) => {
      throw new InternalServerErrorException(`Ocurrió un error al intentar guardar el depósito: ${error}`);
    });
  }

  async findAll(): Promise<Store[]> {
    return await this.storesRepository.find();
  }

  async findAndPaginate(params: IPaginationOptions): Promise<Page<Store>> {
    return await this.storesRepository.findAndPaginate(params);
  }

  async findOne(id: number): Promise<Store> {
    const store = await this.storesRepository.findOne(id);
    if (!store) throw new NotFoundException('El depósito no existe');
    return store;
  }

  async update(id: number, updateStoreDto: UpdateStoreDto): Promise<Store> {
    const store = await this.exists(id);

    if ((store.isPOS && updateStoreDto.isPOS != false) || (!store.isPOS && updateStoreDto.isPOS == true)) {
      if (!updateStoreDto.posFiscalNumber) throw new BadRequestException('Ingrese un número de punto de venta');

      await this.existsByPosFiscalNumber(updateStoreDto.posFiscalNumber, id);

      store.posFiscalNumber = updateStoreDto.posFiscalNumber;
    }

    const updatedStore = new Store(updateStoreDto);

    await this.storesRepository.update(id, updatedStore).catch((error) => {
      throw new InternalServerErrorException(`Ocurrió un error al intentar modificar el depósito: ${error}`);
    });

    return await this.findOne(id).catch((error) => {
      throw new InternalServerErrorException(`Ocurrió un error al intentar modificar el depósito: ${error}`);
    });
  }

  async remove(id: number): Promise<ResponseDto> {
    const store = await this.storesRepository.findOne(id, {
      relations: ['stocks'],
    });
    if (!store) throw new NotFoundException('El depósito no existe');

    await this.storesRepository.softRemove(store).catch((error) => {
      throw new InternalServerErrorException(`Ocurrió un error al intentar borrar el depósito: ${error}`);
    });

    return { statusCode: 202, message: 'Depósito borrado' };
  }

  async initDB() {
    if ((await this.storesRepository.count()) == 0) {
      const store = new Store();
      store.name = 'Sucursal 1';
      store.phoneNumber = '0123456789';
      store.address = 'Dirección de ejemplo';
      store.city = await this.citiesService.exists(43);
      store.isPOS = true;

      await this.storesRepository.save(store);
    }
  }
}
