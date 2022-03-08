import { forwardRef, Module } from '@nestjs/common';
import { SectorsService } from './sectors.service';
import { SectorsController } from './sectors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SectorsRepository } from './sectors.repository';
import { LinesModule } from 'src/lines/lines.module';

@Module({
  imports: [TypeOrmModule.forFeature([SectorsRepository]), forwardRef(() => LinesModule)],
  controllers: [SectorsController],
  providers: [SectorsService],
  exports: [SectorsService],
})
export class SectorsModule {}
