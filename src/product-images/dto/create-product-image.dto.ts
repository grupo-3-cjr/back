import { IsInt, IsString } from 'class-validator';

export class CreateProductImageDto {
    @IsInt()
    product_id!: number;

    @IsString()
    image_url!: string;

    @IsInt()
    order!: number;
}