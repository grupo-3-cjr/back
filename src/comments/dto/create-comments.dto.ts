import { IsInt, IsString } from 'class-validator';

export class CreateCommentsDto {
    @IsInt()
    user_id!:  number;

    @IsInt()
    store_rating_id!:  number;

    @IsInt()
    product_rating_id!:  number;
    
    @IsString()
    content!:  string;
}
