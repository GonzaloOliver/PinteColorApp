import { Type } from 'class-transformer';
import { IsNotEmpty, IsNotEmptyObject, IsString, ValidateNested } from 'class-validator';
import { Sector } from 'src/sectors/entities/sector.entity';

export class CreateLineDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @Type(() => Sector)
  @ValidateNested()
  @IsNotEmptyObject()
  readonly sector: Sector;
}
