import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { IPaginationOptions, Page, paginate } from 'src/pagination';
import { CitiesService } from 'src/shared/location/cities/cities.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { Supplier } from './entities/supplier.entity';
import { SuppliersRepository } from './suppliers.repository';

@Injectable()
export class SuppliersService {
  constructor(
    private readonly suppliersRepository: SuppliersRepository,
    private readonly citiesService: CitiesService,
  ) {}

  async exists(id: number): Promise<Supplier> {
    const supplierExists = await this.suppliersRepository.findOne(id);

    if (!supplierExists) throw new NotFoundException('El proveedor no existe');

    return supplierExists;
  }

  async create(createSupplierDto: CreateSupplierDto) {
    const supplierCode = createSupplierDto.code.toUpperCase();
    const supplierExistsByCode = await this.suppliersRepository.findOneByCode(supplierCode);
    if (supplierExistsByCode) throw new ConflictException('Ya existe un proveedor con el código ingresado');

    const supplierExistsByCuit = await this.suppliersRepository.findOneByCuit(createSupplierDto.cuit);
    if (supplierExistsByCuit) throw new ConflictException('Ya existe un proveedor con el CUIT ingresado');

    const supplier = new Supplier();

    supplier.businessName = createSupplierDto.businessName;
    supplier.contactFullName = createSupplierDto.contactFullName;
    supplier.cuit = createSupplierDto.cuit;
    supplier.email = createSupplierDto.email;
    supplier.ivaCondition = createSupplierDto.ivaCondition;
    supplier.phoneNumber = createSupplierDto.phoneNumber;
    supplier.code = supplierCode;
    supplier.address = createSupplierDto.address;
    supplier.city = await this.citiesService.exists(createSupplierDto.city.id);

    return await this.suppliersRepository.save(supplier).catch((error) => {
      throw new InternalServerErrorException(`Ocurrió un error al guardar el proveedor: ${error}`);
    });
  }

  async findAll(): Promise<Supplier[]> {
    return this.suppliersRepository.find();
  }

  async findAndPaginate(params: IPaginationOptions): Promise<Page<Supplier>> {
    return paginate<Supplier>(this.suppliersRepository, params);
  }

  async findOne(id: number) {
    const supplier = await this.exists(id);
    return supplier;
  }

  async update(id: number, updateSupplierDto: UpdateSupplierDto) {
    await this.exists(id);

    const supplierExistsByCuit = await this.suppliersRepository.findOneByCuit(updateSupplierDto.cuit);
    if (supplierExistsByCuit && supplierExistsByCuit.id != id)
      throw new ConflictException('El CUIT ingresado está siendo usado por otro proveedor');

    await this.suppliersRepository.update(id, updateSupplierDto);

    return await this.findOne(id);
  }

  async remove(id: number) {
    const supplier = await this.exists(id);

    if (await supplier.hasGoods())
      throw new ConflictException('El proveedor no debe estar asociado a ningún artículo antes de borrarse');

    await this.suppliersRepository.softDelete(id);

    return { statusCode: 200, message: 'Proveedor borrado' };
  }

  async verifyCode(code: string, id: number) {
    const supplier = await this.exists(id);

    if (code !== supplier.code)
      throw new BadRequestException(`El código del proveedor no es válido, debe ser ${supplier.code}`);
  }
}
