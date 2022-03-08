import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProvincesRepository } from './provinces.repository';
import { ProvincesService } from './provinces.service';
import { ProvincesController } from './provinces.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProvincesRepository])],
  providers: [ProvincesService],
  exports: [ProvincesService],
  controllers: [ProvincesController],
})
export class ProvincesModule {}
