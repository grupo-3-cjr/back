import {
    IsInt,
    IsString,
    IsNumber,
    Min, 
}   from "class-validator";


export class CreateProductDto {
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

