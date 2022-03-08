import { IsEmail, IsEnum, IsString } from 'class-validator';
import { IVA } from 'src/shared/enums/iva.enum';

export class UpdateCompanyInfoDto {
  @IsEmail()
  readonly email: string;

  @IsString()
  readonly businessName: string;

  @IsString()
  readonly cuit: string;

  @IsString()
  @IsEnum(IVA)
  readonly ivaCondition: string;
}
