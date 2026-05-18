import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService){}

  async create(createProductDto: CreateProductDto) {
    const createdProduct = await this.prisma.products.create({
      data: {
        store_id: createProductDto.store_id,
        category_id: createProductDto.category_id,
        name: createProductDto.name,
        description: createProductDto.description,
        price: createProductDto.price,
        stock: createProductDto.stock,  
      },
    });
    return createdProduct;
  }


   async findAll() {
    return this.prisma.products.findMany({
      include: {
        store: true,
        category: true,
        productImage: true,
      },
    });
  }
  

   async findOne(id: number) {
    const Product=await this.prisma.products.findUnique({
      where: {id},
      include: {
        store: true,
        category: true,
        productImage: true,
        productRating: true,
      },
    });

    if(!Product){
      throw new NotFoundException(`Produto com ID #${id} não encontrado.`);
    }
    return Product;
  }


  async update(id: number, updateProductDto: UpdateProductDto) {
    try{
      return await this.prisma.products.update({
        where: {id},
        data: {... updateProductDto},
  });
    }catch(error: any){
      if(error.code==='P2025'){
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

