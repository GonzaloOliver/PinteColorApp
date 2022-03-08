import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateSupplierDto } from './create-supplier.dto';

export class UpdateSupplierDto extends OmitType(PartialType(CreateSupplierDto), ['code']) {}
