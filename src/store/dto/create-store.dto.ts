import { IsInt, IsString } from 'class-validator';

export class CreateStoreDto {
  @IsInt()
  user_id!: number;

  @IsInt()
  category_id!: number;

  @IsString()
  name!: string;

  @IsString()
  description!: string;

  @IsString()
  logo_url!: string;

  @IsString()
  banner_url!: string;

  @IsString()
  sticker_url!: string;

  @IsString()
  created_url!: string;
}
