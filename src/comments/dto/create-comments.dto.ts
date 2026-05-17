import { IsInt, IsString, IsNotEmpty} from 'class-validator';

export class CreateCommentsDto {
    @IsInt()
    @IsNotEmpty()
    user_id!:  number;

    @IsInt()
    store_rating_id!:  number;

    @IsInt()
    product_rating_id!:  number;
    
    @IsString()
    @IsNotEmpty()
    content!:  string;
}
