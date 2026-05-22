import { Module } from '@nestjs/common';
import { StoreRatingsService } from './store-ratings.service';
import { StoreRatingsController } from './store-ratings.controller';

@Module({
  controllers: [StoreRatingsController],
  providers: [StoreRatingsService],
})
export class StoreRatingsModule {}
