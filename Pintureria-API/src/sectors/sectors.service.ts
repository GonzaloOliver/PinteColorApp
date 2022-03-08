import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Line } from 'src/lines/entities/line.entity';
import { LinesService } from 'src/lines/lines.service';
import { IPaginationOptions, Page, paginate } from 'src/pagination';
import { CreateSectorDto, UpdateSectorDto } from './dto';
import { Sector } from './entities/sector.entity';
import { SectorsRepository } from './sectors.repository';

@Injectable()
export class SectorsService {
  constructor(
    private readonly sectorsRepository: SectorsRepository,
    @Inject(forwardRef(() => LinesService)) private readonly linesService: LinesService,
  ) {}

  async exists(id: number): Promise<Sector> {
    const sectorExists = await this.sectorsRepository.findOne(id);

    if (!sectorExists) throw new NotFoundException('El rubro no existe');

    return sectorExists;
  }

  async existsByName(name: string, id?: number): Promise<void> {
    const sectorExists = await this.sectorsRepository.findByName(name);

    if (sectorExists && sectorExists.id != id)
      throw new ConflictException('Ya existe un rubro con el nombre ingresado');
  }

  async create(createSectorDto: CreateSectorDto) {
    await this.existsByName(createSectorDto.name);

    const sector = new Sector(createSectorDto);

    return await this.sectorsRepository.save(sector);
  }

  findAndPaginate(params: IPaginationOptions): Promise<Page<Sector>> {
    return this.sectorsRepository.findAndPaginate(params);
  }

  findAll(): Promise<Sector[]> {
    return this.sectorsRepository.find();
  }

  async findOne(id: number): Promise<Sector> {
    const sector = await this.exists(id);
    return sector;
  }

  async findLines(id: number): Promise<Line[]> {
    const sector = await this.exists(id);

    return await this.linesService.findBySector(sector);
  }

  async update(id: number, updateSectorDto: UpdateSectorDto): Promise<Sector> {
    await this.exists(id);

    await this.existsByName(updateSectorDto.name, id);

    const wasModified = await this.sectorsRepository.update(id, updateSectorDto);

    if (!wasModified) throw new InternalServerErrorException('Ocurrió un error al intentar modificar el rubro');

    return await this.findOne(id);
  }

  async remove(id: number) {
    const sector = await this.exists(id);

    if (await sector.hasLines()) throw new ConflictException('El rubro debe estar vacío antes de borrarse');

    const wasDeleted = await this.sectorsRepository.softDelete(id);

    if (!wasDeleted) throw new InternalServerErrorException('Ocurrió un error al intentar borrar el rubro');

    return { statusCode: 202, message: 'Rubro borrado' };
  }
}
