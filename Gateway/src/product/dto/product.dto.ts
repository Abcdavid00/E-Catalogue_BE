import { ApiProperty } from "@nestjs/swagger";
import { CategoryDto } from "./category.dto";

export class ProductsDto {
    @ApiProperty({
        description: "Id of the product",
    })
    id: number;

    @ApiProperty({
        description: "Name of the product",
    })
    name: string;

    @ApiProperty({
        description: "Description of the product",
    })
    description: string;

    // @ApiProperty({
    //     description: "Category of the product",
    // })
    // category: number;

    // @ApiProperty({
    //     description: "Brand of the product",
    // })
    // brand: number;

    @ApiProperty({
        description: "Image of the product",
    })
    image: string;
}

export class ProductDto {
    @ApiProperty({
        description: "Id of the product",
    })
    id: number;

    @ApiProperty({
        description: "Name of the product",
    })
    name: string;

    @ApiProperty({
        description: "Description of the product",
    })
    description?: string;

    @ApiProperty({
        description: "Category of the product",
    })
    category: CategoryDto;

    @ApiProperty({
        description: "Main image of the product",
    })
    image: string;

    @ApiProperty({
        description: "Variants of the product",
    })
    variants?: any[];

    @ApiProperty({
        description: "Images of the product",
    })
    images?: string[];
}