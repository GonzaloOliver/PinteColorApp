import { Module } from '@nestjs/common';
import { ProvincesModule } from './provinces/provinces.module';
import { CitiesModule } from './cities/cities.module';

@Module({
  imports: [ProvincesModule, CitiesModule],
  exports: [ProvincesModule, CitiesModule],
})
export class LocationModule {}
