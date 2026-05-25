import { IsInt, IsString, Max, Min } from 'class-validator';

export class CreateStoreRatingDto {
    @IsInt()
    user_id!: number;

    @IsInt()
    store_id!: number;

    @Min(1)
    @Max(5)
    @IsInt()
    rating!: number;

    @IsString()
    comment!: string;
}