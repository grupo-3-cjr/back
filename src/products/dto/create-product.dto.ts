import {
    IsInt,
    IsString,
    IsNumber,
    Min, 
}   from "class-validator";
import { IsPublic } from "src/auth/decorators/is-public.decorator";


export class CreateProductDto {


    @IsNumber()
    store_id!: number;

    @IsNumber()
    category_id!: number;

    @IsString()
    name!: string;

    @IsString()
    description!: string;

    @IsNumber()
    @Min(0)
    price!: number;

    @IsInt()
    @Min(0)
    stock!: number;


}

