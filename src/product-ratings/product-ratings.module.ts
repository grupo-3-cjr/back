import { Module } from '@nestjs/common';
import { ProductRatingsService } from './product-ratings.service';
import { ProductRatingsController } from './product-ratings.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProductRatingsController],
  providers: [ProductRatingsService],
})
export class ProductRatingsModule {}
