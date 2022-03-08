import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { IPaginationOptions, Page } from 'src/pagination';
import { Sector } from 'src/sectors/entities/sector.entity';
import { SectorsService } from 'src/sectors/sectors.service';
import { CreateLineDto, UpdateLineDto } from './dto';
import { Line } from './entities/line.entity';
import { LinesRepository } from './lines.repository';

@Injectable()
export class LinesService {
  constructor(
    private readonly linesRepository: LinesRepository,
    @Inject(forwardRef(() => SectorsService)) private readonly sectorsService: SectorsService,
  ) { }

  async exists(id: number): Promise<Line> {
    const lineExists = await this.linesRepository.findOne(id);

    if (!lineExists) throw new NotFoundException('La linea no existe');

    return lineExists;
  }

  async existsByName(name: string, id?: number): Promise<void> {
    const lineExists = await this.linesRepository.findByName(name);

    if (lineExists && lineExists.id != id) throw new ConflictException('Ya existe una linea con el nombre ingresado');
  }

  async create(createLineDto: CreateLineDto) {
    await this.existsByName(createLineDto.name);

    const sector = await this.sectorsService.exists(createLineDto.sector.id);

    const line = new Line(createLineDto, sector);

    return await this.linesRepository.save(line);
  }

  findAndPaginate(params: IPaginationOptions): Promise<Page<Line>> {
    return this.linesRepository.findAndPaginate(params);
  }

  findAll(): Promise<Line[]> {
    return this.linesRepository.find();
  }

  async findBySector(sector: Sector): Promise<Line[]> {
    return await this.linesRepository.find({ loadEagerRelations: false, where: { sector: sector } });
  }

  async findOne(id: number): Promise<Line> {
    const line = await this.exists(id);
    return line;
  }

  async update(id: number, updateLineDto: UpdateLineDto): Promise<Line> {
    await this.exists(id);

    await this.existsByName(updateLineDto.name, id);

    const sector = updateLineDto.sector ? await this.sectorsService.exists(updateLineDto.sector.id) : undefined;

    const newLine = new Line(updateLineDto, sector);

    const wasModified = await this.linesRepository.update(id, newLine);

    if (!wasModified) throw new InternalServerErrorException('Ocurrió un error al intentar modificar la linea');

    return await this.findOne(id);
  }

  async remove(id: number) {
    const line = await this.exists(id);

    if (await line.hasGoods())
      throw new ConflictException('La linea no debe estar asociada a ningún artículo antes de borrarse');

    const wasDeleted = await this.linesRepository.softDelete(id);

    if (!wasDeleted) throw new InternalServerErrorException('Ocurrió un error al intentar borrar la linea');

    return { statusCode: 200, message: 'Linea borrada' };
  }
}
