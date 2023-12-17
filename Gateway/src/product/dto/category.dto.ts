import { ApiProperty } from "@nestjs/swagger";
import { ProductsDto } from "./product.dto";

export class CategoriesDto {
    @ApiProperty({
        description: "Id of the category",
    })
    id: number;

    @ApiProperty({
        description: "Name of the category",
    })
    name: string;

    @ApiProperty({
        description: "Description of the category",
    })
    description: string;

    @ApiProperty({
        description: "Image of the category",
    })
    image: string;

    @ApiProperty({
        description: "Children of the category",
    })
    children: CategoriesDto[];
}

export class CategoryDto {
    @ApiProperty({
        description: "Id of the category",
    })
    id: number;

    @ApiProperty({
        description: "Name of the category",
    })
    name: string;

    @ApiProperty({
        description: "Description of the category",
    })
    description: string;

    @ApiProperty({
        description: "Image of the category",
    })
    image: string;

    @ApiProperty({
        description: "Products of the category",
    })
    products: ProductsDto[];
}