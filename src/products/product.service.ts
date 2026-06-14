import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Product } from './entities/product.entity';


@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService){}

async create(createProductDto: CreateProductDto) {
    const { images, ...productData } = createProductDto;

    const createdProduct = await this.prisma.products.create({
      data: {
        ...productData, 
        
        productImage: {
          create: images?.map((url, index) => ({
            image_url: url,
            order: index, 
          })) || [], 
        },
      },
      include: {
        productImage: true, 
      }
    });

    return createdProduct;
  }


   async findAll(search?: string, store_id?: number, categoria_id?: number) {
  return this.prisma.products.findMany({
    where: {
      ...(search ? { name: { contains: search } } : {}),
      ...(store_id ? { store_id } : {}),
      ...(categoria_id ? { category_id: categoria_id } : {}),
    },
    include: {
      store: true,
      category: true,
      productImage: true,
    },
  });
}
  

  async findOne(id: number) {
    const produto = await this.prisma.products.findUnique({
      where: { id },
      include: {
        category: true, 
        store: true,    
        productImage: {
          orderBy: { order: 'asc' } // Traz as imagens ordenadas
        },
        productRating: {
          include: {
            user: true // Traz quem avaliou 
          }
        }
      }
    });

    if(!produto){
      throw new NotFoundException(`Produto com ID #${id} não encontrado.`);
    }
    return produto;
  }


async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      const { images, ...productData } = updateProductDto;

      return await this.prisma.products.update({
        where: { id },
        data: {
          ...productData,
        
          ...(images !== undefined && {
            productImage: {
              deleteMany: {}, 
              create: images.map((url, index) => ({
                image_url: url,
                order: index, 
              })),
            },
          }),
        },
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Produto com ID#${id} não encontrado.`);
      }
      throw error;
    }
  }
 async remove(id: number, ) {
  try{
    return await this.prisma.products.delete({
      where: {id},
    });
  }catch(error: any){
    if(error.code==='P2025'){
      throw new NotFoundException(`Produto com ID#${id} não encontrado.`);
      }
      throw error;
    } 
  }
}
