import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const createdCategory = await this.prisma.categories.create({
      data: {
        name: createCategoryDto.name,
        parent_category_id: createCategoryDto.parent_category_id,
      },
    });

    return createdCategory;
  }

  async findAll() {
    return this.prisma.categories.findMany({
      select: {
        id: true,
        name: true,
        parent_category_id: true,
      },
    });
  }

  async findOne(id: number) {
    const category = await this.prisma.categories.findUnique({
      where: {id},
      select: {
        id: true,
        name: true,
        parent_category_id: true,
      },
    });

    if (!category) {
      throw new NotFoundException(`Categoria com ID #${id} não encontrado.`);
    }

    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      const updatedCategory = await this.prisma.categories.update({
        where: {id},
        data: updateCategoryDto,
      });

      return updatedCategory;
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Categoria com ID #${id} não encontrada.`);
      }

      if (error.code === 'P2002') {
        throw new ConflictException('Já existe uma categoria com esses dados');
      }

      throw error;
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.categories.delete({
        where: {id},
      });
    } catch (error:any) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Categoria com ID #${id} não encontrada.`);
      }

      throw error;
    }
  }
}
