import { forwardRef, Module } from '@nestjs/common';
import { LinesService } from './lines.service';
import { LinesController } from './lines.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LinesRepository } from './lines.repository';
import { SectorsModule } from 'src/sectors/sectors.module';

@Module({
  imports: [TypeOrmModule.forFeature([LinesRepository]), forwardRef(() => SectorsModule)],
  controllers: [LinesController],
  providers: [LinesService],
  exports: [LinesService],
})
export class LinesModule {}
