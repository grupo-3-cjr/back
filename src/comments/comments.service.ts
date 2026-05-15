import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentsDto } from './dto/create-comments.dto';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService){}
  
    async create (createCommentsDto: CreateCommentsDto) {
        const createdComments = await this.prisma.ratingComments.create({
            data: {
                user_id: createCommentsDto.user_id,
                store_rating_id: createCommentsDto.store_rating_id,
                product_rating_id: createCommentsDto.product_rating_id,
                content: createCommentsDto.content,
            },
        });

    return createdComments;
    }

}
