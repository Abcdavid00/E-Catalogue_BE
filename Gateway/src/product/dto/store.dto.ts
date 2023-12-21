import { ApiProperty } from "@nestjs/swagger";

export class StoresDto {
    @ApiProperty({
        description: "Id of the store",
    })
    id: number;

    @ApiProperty({
        description: "Name of the store",
    })
    name?: string;

    @ApiProperty({
        description: "Description of the store",
    })
    description?: string;

    @ApiProperty({
        description: "Logo image of the store",
    })
    logo_image?: string;

    @ApiProperty({
        description: "Cover image of the store",
    })
    cover_image?: string;

    @ApiProperty({
        description: "Whether the store is approved or not",
    })
    approved?: boolean;
}

export class StoreDto {
    
}