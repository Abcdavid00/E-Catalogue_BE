import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class EmailDto {
    @ApiProperty({
        description: "Email of the user"
    })
    @IsString()
    email: string;
}