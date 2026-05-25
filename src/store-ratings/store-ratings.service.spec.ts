import { Test, TestingModule } from '@nestjs/testing';
import { StoreRatingsService } from './store-ratings.service';

describe('StoreRatingsService', () => {
  let service: StoreRatingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StoreRatingsService],
    }).compile();

    service = module.get<StoreRatingsService>(StoreRatingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
