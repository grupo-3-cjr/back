import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Injectable()
export class StoreService {
  constructor(private prisma: PrismaService) {}

  async create(createStoreDto: CreateStoreDto) {
    const createdStore = await this.prisma.stores.create({
      data: {
        user_id: createStoreDto.user_id,
        category_id: createStoreDto.category_id,
        name: createStoreDto.name,
        description: createStoreDto.description,
        logo_url: createStoreDto.logo_url,
        banner_url: createStoreDto.banner_url,
        sticker_url: createStoreDto.sticker_url,
        created_url: createStoreDto.created_url,
      },
    });

    return createdStore;
  }

  async findAll(search?: string) {
    return this.prisma.stores.findMany({
      where: search
        ? {
          name: {
            contains: search,
          },
        }
        : undefined,
      select: {
        id: true,
        user_id: true,
        category_id: true,
        name: true,
        description: true,
        logo_url: true,
        banner_url: true,
        sticker_url: true,
        created_url: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findOne(id: number) {
    const store = await this.prisma.stores.findUnique({
      where: { id },
      select: {
        id: true,
        user_id: true,
        category_id: true,
        name: true,
        description: true,
        logo_url: true,
        banner_url: true,
        sticker_url: true,
        created_url: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!store) {
      throw new NotFoundException(`Loja com ID #${id} não encontrado.`);
    }
    return store;
  }

  async update(id: number, updateStoreDto: UpdateStoreDto) {
    try {
      const updatedStore = await this.prisma.stores.update({
        where: { id },
        data: updateStoreDto,
      });

      return updatedStore;
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Loja com ID #${id} não encontrada.`);
      }

      if (error.code === 'P2002') {
        throw new ConflictException('Já existe uma loja com esses dados.');
      }

      throw error;
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.stores.delete({
        where: { id },
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Loja com ID #${id} não encontrada.`);
      }

      throw error;
    }
  }
}
