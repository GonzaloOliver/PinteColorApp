import { Module } from '@nestjs/common';
import { LocationModule } from './location/location.module';

@Module({
  imports: [LocationModule],
  exports: [LocationModule],
})
export class SharedModule {}
