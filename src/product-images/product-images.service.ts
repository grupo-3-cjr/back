import { Injectable, ConflictException, NotFoundException, } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductImageDto } from './dto/create-product-image.dto';
import { UpdateProductImageDto } from './dto/update-product-image.dto';

@Injectable()
export class ProductImagesService {
  constructor(private prisma: PrismaService) {}

  async create(createProductImageDto: CreateProductImageDto) {
    const createdProductImage = await this.prisma.productImages.create({
      data: {
        product_id: createProductImageDto.product_id,
        image_url: createProductImageDto.image_url,
        order: createProductImageDto.order,
      },
    });

    return createdProductImage;
  }

  async findAll() {
    return await this.prisma.productImages.findMany({
      select: {
        id: true,
        product_id: true,
        image_url: true,
        order: true,
      },
    });
  }

  async findOne(id: number) {
    const productImage = await this.prisma.productImages.findUnique({
      where: { id },
      select: {
        id: true,
        product_id: true,
        image_url: true,
        order: true,
      },
    });

    if (!productImage) {
      throw new NotFoundException(`Imagem do produto com ID ${id} não encontrada.`);
    }

    return productImage;
  }

  async update(id: number, updateProductImageDto: UpdateProductImageDto) {
    try {
      const updatedProductImage = await this.prisma.productImages.update({
        where: { id },
        data: updateProductImageDto,
      });

      return updatedProductImage;
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Imagem do produto com ID ${id} não encontrada.`);
      }

      if (error.code === 'P2002') {
        throw new ConflictException('Já existe uma imagem do produto com estes dados.');
      }

      throw error;
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.productImages.delete({
        where: { id },
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Imagem do produto com ID ${id} não encontrada.`);
      }

      throw error;
    }
  }
}
