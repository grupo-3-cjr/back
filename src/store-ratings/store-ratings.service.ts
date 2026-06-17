import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStoreRatingDto } from './dto/create-store-rating.dto';
import { UpdateStoreRatingDto } from './dto/update-store-rating.dto';

@Injectable()
export class StoreRatingsService {
  constructor(private prisma: PrismaService) {}

  async create(createStoreRatingDto: CreateStoreRatingDto) {
    const createdStoreRating = await this.prisma.storeRatings.create({
      data: {
        user_id: createStoreRatingDto.user_id,
        store_id: createStoreRatingDto.store_id,
        rating: createStoreRatingDto.rating,
        comment: createStoreRatingDto.comment,
      },
    });

    return createdStoreRating;
  }

  async findAll(user_id?: number) {
    return this.prisma.storeRatings.findMany({
      where: {
        ...(user_id ? { user_id: user_id } : {})
      },
      select: {
        id: true,
        user_id: true,
        store_id: true,
        rating: true,
        comment: true,
        user: {
         select: {
          name: true,
          profile_picture_url: true,
        },
      },
    },
  });
}

  async findOne(id: number) {
    const storeRating = await this.prisma.storeRatings.findUnique({
      where: { id },
      select: {
        id: true,
        user_id: true,
        store_id: true,
        rating: true,
        comment: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            profile_picture_url: true,
          }
        }
      },
    });

    if (!storeRating) {
      throw new NotFoundException(`Avaliação de loja com ID ${id} não encontrado.`);
    }

    return storeRating;
  }

  async update(id: number, updateStoreRatingDto: UpdateStoreRatingDto) {
    try {
      const updatedStoreRatingDto = await this.prisma.storeRatings.update({
        where: { id },
        data: updateStoreRatingDto,
      });

      return updatedStoreRatingDto;
    } catch (error:any) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Avaliação de loja com ID ${id} não encontado.`);
      }

      throw error;
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.storeRatings.delete({
        where: { id },
      });
    } catch (error:any) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Avaliação de loja com ID ${id} não encontrado.`);
      }

      throw error;
    }
  }
}
