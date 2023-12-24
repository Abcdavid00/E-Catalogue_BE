import { ApiProperty } from "@nestjs/swagger";
import { AddressDto } from "./address.dto";

export class ContactDto {
    @ApiProperty({
        description: "Id of the contact",
    })
    id: number;

    @ApiProperty({
        description: "Phone of the contact",
    })
    phone: string;

    @ApiProperty({
        description: "Address of the contact",
        type: AddressDto
    })
    address: AddressDto
}