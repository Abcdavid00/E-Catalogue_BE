import { ApiProperty } from "@nestjs/swagger";

export class AddressDto {
    @ApiProperty({
        description: "Id of the address",
    })
    id: number;

    @ApiProperty({
        description: "Id of the address",
    })
    province: string;

    @ApiProperty({
        description: "City of the address",
    })
    city: string;

    @ApiProperty({
        description: "District of the address",
    })
    district: string;

    @ApiProperty({
        description: "Details of the address",
        nullable: true
    })
    details: string;
}