import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UsernameDto {
    @ApiProperty({
        description: "Username"
    })
    @IsString()
    username: string;
}