import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { IPaginationOptions, Page, paginate } from 'src/pagination';
import { getFilters } from 'src/pagination/getFilters';
import { SettingsService } from 'src/settings/settings.service';
import { ResponseDto } from 'src/shared/dto/response.dto';
import { IdType } from 'src/shared/enums';
import { CitiesService } from 'src/shared/location/cities/cities.service';
import { CustomersRepository } from './customers.repository';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';

@Injectable()
export class CustomersService {
  constructor(
    private readonly customersRepository: CustomersRepository,
    private readonly citiesService: CitiesService,
    private readonly settingsService: SettingsService,
  ) { }

  async exists(id: number): Promise<Customer> {
    const customerExists = await this.customersRepository.findOne(id);

    if (!customerExists) throw new NotFoundException('El cliente no existe');

    return customerExists;
  }

  async existsByIdNumber(idNumber: string, idType: IdType, id?: number): Promise<void> {
    const customerExists = await this.customersRepository.findByIdNumber(idNumber, idType);

    if (customerExists && customerExists.getId() != id)
      throw new ConflictException(`Ya existe un cliente con el ${idType} ingresado`);
  }

  isIdTypeCorrect(idNumber: string, idType: IdType): boolean {
    if (idType == IdType.DU) {
      if (idNumber.length == 8) return true;
      throw new BadRequestException('El DU ingresado no es válido');
    }
    if (idNumber.length > 8) return true;
    throw new BadRequestException('El CUIL/CUIT ingresado no es válido');
  }

  async findAll(params: IPaginationOptions): Promise<Customer[]> {
    const searchOptions = await getFilters<Customer>(params);
    return await this.customersRepository.find({ ...searchOptions });
  }

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    this.isIdTypeCorrect(createCustomerDto.idNumber, createCustomerDto.idType);

    await this.existsByIdNumber(createCustomerDto.idNumber, createCustomerDto.idType);

    await this.citiesService.exists(createCustomerDto.city.id);

    const newCustomer = new Customer(createCustomerDto);

    const customer = await this.customersRepository.save(newCustomer).catch((error) => {
      throw new InternalServerErrorException('Ocurrió un error al intentar crear el cliente');
    });

    return await this.findOne(customer.getId());
  }

  async findAndPaginate(params: IPaginationOptions): Promise<Page<Customer>> {
    const paginated = await paginate<Customer>(this.customersRepository, params);
    for (const customer of paginated.content) {
      customer.debtReturn = await this.getDebt(customer.id);
    }
    return paginated;
  }

  async findOne(id: number): Promise<Customer> {
    const customer = await this.exists(id);
    customer.debtReturn = await this.getDebt(customer.id);
    return customer;
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    this.isIdTypeCorrect(updateCustomerDto.idNumber, updateCustomerDto.idType);

    await this.exists(id);

    await this.existsByIdNumber(updateCustomerDto.idNumber, updateCustomerDto.idType, id);

    await this.citiesService.exists(updateCustomerDto.city.id);

    await this.customersRepository.update(id, updateCustomerDto).catch((error) => {
      throw new InternalServerErrorException('Ocurrió un error al intentar modificar la marca.');
    });

    return await this.findOne(id);
  }

  async remove(id: number): Promise<ResponseDto> {
    await this.exists(id);

    await this.customersRepository.softDelete(id).catch((error) => {
      throw new InternalServerErrorException('Ocurrió un error al intentar borrar el cliente');
    });

    return { statusCode: 202, message: 'Cliente borrado' };
  }

  async getDebt(id: number) {
    const customer = await this.exists(id);

    var debt = customer.debt;
    const dbKey = await this.settingsService.getS();

    if (dbKey) {
      debt = debt + customer.debtX;

      return {
        customerId: id,
        totalDebt: debt,
        debt: customer.debt,
        debtX: customer.debtX,
      };
    }

    return { customerId: id, totalDebt: debt };
  }
}
