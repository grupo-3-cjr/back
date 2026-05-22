import { Module } from '@nestjs/common';
import { ProductRatingsService } from './product-ratings.service';
import { ProductRatingsController } from './product-ratings.controller';

@Module({
  controllers: [ProductRatingsController],
  providers: [ProductRatingsService],
})
export class ProductRatingsModule {}
