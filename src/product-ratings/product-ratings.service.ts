import { Injectable, NotFoundException, } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductRatingDto } from './dto/create-product-rating.dto';
import { UpdateProductRatingDto } from './dto/update-product-rating.dto';

@Injectable()
export class ProductRatingsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductRatingDto: CreateProductRatingDto) {
    const createdProductRating = await this.prisma.productRatings.create({
      data: {
        user_id: createProductRatingDto.user_id,
        product_id: createProductRatingDto.product_id,
        rating: createProductRatingDto.rating,
        comment: createProductRatingDto.comment,
      },
    });

    return createdProductRating;
  }

  async findAll(user_id?: number) {
    return this.prisma.productRatings.findMany({
      where: {
        ...(user_id ? { user_id: user_id } : {})
      },
      select: {
        id: true,
        user_id: true,
        product_id: true,
        rating: true,
        comment: true,
      },
    });
  }

  async findOne(id: number) {
    const productRating = await this.prisma.productRatings.findUnique({
      where: { id },
      select: {
        id: true,
        user_id: true,
        product_id: true,
        rating: true,
        comment: true,
      },
    });

    if (!productRating) {
    throw new NotFoundException(`Avaliação do produto com ID #${id} não encontrado.`);
    }

    return productRating;
  }

  async update(id: number, updateProductRatingDto: UpdateProductRatingDto) {
    try {
      const updatedProductRatingDto = await this.prisma.productRatings.update({
        where: { id },
        data: updateProductRatingDto,
      });

      return updatedProductRatingDto;
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Avaliação do produto com ID #${id} não encontrado.`);
      }

      throw error;
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.productRatings.delete({
        where: { id },
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Avaliação do produto com ID #${id} não encontrada.`);
      }

      throw error;
    }
  }
}
