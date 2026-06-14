import { IsInt, IsString, Max, Min } from 'class-validator';

export class CreateProductRatingDto {
    @IsInt()
    user_id!: number;

    @IsInt()
    product_id!: number;

    @Min(1)
    @Max(5)
    @IsInt()
    rating!: number;

    @IsString()
    comment!: string;
}