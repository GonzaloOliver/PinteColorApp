import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CitiesRepository } from './cities.repository';
import { CitiesService } from './cities.service';

@Module({
  imports: [TypeOrmModule.forFeature([CitiesRepository])],
  providers: [CitiesService],
  exports: [CitiesService],
})
export class CitiesModule {}
