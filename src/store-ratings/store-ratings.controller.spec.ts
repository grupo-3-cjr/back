import { Test, TestingModule } from '@nestjs/testing';
import { StoreRatingsController } from './store-ratings.controller';
import { StoreRatingsService } from './store-ratings.service';

describe('StoreRatingsController', () => {
  let controller: StoreRatingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoreRatingsController],
      providers: [StoreRatingsService],
    }).compile();

    controller = module.get<StoreRatingsController>(StoreRatingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
