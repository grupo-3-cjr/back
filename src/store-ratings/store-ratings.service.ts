import { Injectable } from '@nestjs/common';
import { CreateStoreRatingDto } from './dto/create-store-rating.dto';
import { UpdateStoreRatingDto } from './dto/update-store-rating.dto';

@Injectable()
export class StoreRatingsService {
  create(createStoreRatingDto: CreateStoreRatingDto) {
    return 'This action adds a new storeRating';
  }

  findAll() {
    return `This action returns all storeRatings`;
  }

  findOne(id: number) {
    return `This action returns a #${id} storeRating`;
  }

  update(id: number, updateStoreRatingDto: UpdateStoreRatingDto) {
    return `This action updates a #${id} storeRating`;
  }

  remove(id: number) {
    return `This action removes a #${id} storeRating`;
  }
}
