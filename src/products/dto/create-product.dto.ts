import {
    IsInt,
    IsString,
    IsNumber,
    Min, 
    IsOptional, 
    IsArray,
}   from "class-validator";

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

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    images?: string[];

}

