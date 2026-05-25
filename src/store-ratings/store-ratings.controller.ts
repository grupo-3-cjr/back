import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StoreRatingsService } from './store-ratings.service';
import { CreateStoreRatingDto } from './dto/create-store-rating.dto';
import { UpdateStoreRatingDto } from './dto/update-store-rating.dto';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';

@IsPublic()
@Controller('store-ratings')
export class StoreRatingsController {
  constructor(private readonly storeRatingsService: StoreRatingsService) {}

  @Post()
  create(@Body() createStoreRatingDto: CreateStoreRatingDto) {
    return this.storeRatingsService.create(createStoreRatingDto);
  }

  @Get()
  findAll() {
    return this.storeRatingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storeRatingsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStoreRatingDto: UpdateStoreRatingDto) {
    return this.storeRatingsService.update(+id, updateStoreRatingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storeRatingsService.remove(+id);
  }
}
