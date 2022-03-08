import { Test, TestingModule } from '@nestjs/testing';
import { PricelistController } from './pricelist.controller';
import { PricelistService } from './pricelist.service';

describe('PricelistController', () => {
  let controller: PricelistController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PricelistController],
      providers: [PricelistService],
    }).compile();

    controller = module.get<PricelistController>(PricelistController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
