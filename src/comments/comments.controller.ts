import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentsDto } from './dto/create-comments.dto';
import { UpdateCommentsDto } from './dto/update-comments.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}
    
  @Post()
      create(@Body() createCommentsDto: CreateCommentsDto) {
        return this.commentsService.create(createCommentsDto);
    }

  @Get()
  findAll(@Query('store_rating_id') store_rating_id?: string) {
  return this.commentsService.findAll(store_rating_id ? +store_rating_id : undefined);
}

  @Get(':id')
    findOne(@Param('id') id: string) {
    return this.commentsService.findOne(+id);
  }

  @Patch(':id')
    update(@Param('id') id: string, @Body() updateCommentsDto: UpdateCommentsDto) {
    return this.commentsService.update(+id, updateCommentsDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return  this.commentsService.remove(+id);
  }


}
