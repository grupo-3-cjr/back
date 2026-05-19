import {
Injectable, 
  InternalServerErrorException, 
  BadRequestException, 
  Logger,
  ConflictException,
  NotFoundException
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateCommentsDto } from './dto/create-comments.dto';
import { UpdateCommentsDto } from './dto/update-comments.dto';



@Injectable()
export class CommentsService {
    constructor(private prisma: PrismaService){}
    private readonly logger = new Logger(CommentsService.name);
    async create (createCommentsDto: CreateCommentsDto) {
        try{
        const createdComments = await this.prisma.ratingComments.create({
            data: {
                user_id: createCommentsDto.user_id,
                store_rating_id: createCommentsDto.store_rating_id,
                product_rating_id: createCommentsDto.product_rating_id,
                content: createCommentsDto.content,
            },
        });

        return createdComments;
        } catch (error: any) {
            this.logger.error(`Falha ao criar comentário: ${error.message}`, error.stack);

            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2003') {
                    throw new BadRequestException('Não foi possível criar o comentário. Verifique se o usuário ou a avaliação informada existem.');
                }
            }
            throw new InternalServerErrorException(
                'Ocorreu um erro interno ao processar seu comentário.'
            );
        }

    }
  async findAll() {
    try {
      return await this.prisma.ratingComments.findMany({
        select: {
          id: true,
          user_id: true,
          store_rating_id: true,
          product_rating_id: true,
          content: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error: any) {
      this.logger.error(`Falha ao buscar comentários: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Erro ao buscar a lista de comentários.');
    }
  }

  async findOne(id: number) {
    const comments = await this.prisma.ratingComments.findUnique({
      where: {id},
      select: {
        id: true,
        user_id: true,
        store_rating_id: true,
        product_rating_id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!comments) {
      throw new NotFoundException(`Comentário com ID #${id} não encontrado.`);
    }
        return comments;
  }

  async update(id: number, updateCommentsDto: UpdateCommentsDto) {
    try {
      const updatedComments = await this.prisma.ratingComments.update({
        where: {id},
        data: updateCommentsDto,
      });

      return updatedComments;
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Comentário com ID #${id} não encontrada.`);
      }

      if (error.code === 'P2002') {
        throw new ConflictException('Já existe uma Comentário com esses dados');
      }

    throw new InternalServerErrorException('Erro interno ao atualizar o comentário.');
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.ratingComments.delete({
        where: { id },
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Comentário com ID #${id} não encontrada.`);
      }

      throw error;
    }
  }


}
