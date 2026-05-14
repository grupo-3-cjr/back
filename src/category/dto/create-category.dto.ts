import { IsInt, IsString, IsOptional } from 'class-validator';


export class CreateCategoryDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsInt()
  parent_category_id?: number;
}