import { Module } from '@nestjs/common';
import { StoreRatingsService } from './store-ratings.service';
import { StoreRatingsController } from './store-ratings.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [StoreRatingsController],
  providers: [StoreRatingsService],
})
export class StoreRatingsModule {}
