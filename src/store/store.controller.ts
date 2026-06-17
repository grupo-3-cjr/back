import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';

@IsPublic()
@Controller('store')
export class StoreController {

  constructor(private readonly storeService: StoreService) {}

  @Post()
  create(@Body() createStoreDto: CreateStoreDto) {
    return this.storeService.create(createStoreDto);
  }

  @Get()
  findAll(@Query('search') search?: string, @Query('categoria_id') categoria_id?: string, @Query('user_id') user_id?: string) {
    return this.storeService.findAll(search, categoria_id ? +categoria_id : undefined, user_id ? +user_id : undefined);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStoreDto: UpdateStoreDto) {
    return this.storeService.update(+id, updateStoreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storeService.remove(+id);
  }
}
