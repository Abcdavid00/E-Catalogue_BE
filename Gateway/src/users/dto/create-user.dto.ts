import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateUserDto {
    @ApiProperty({
        description: "Username"
    })
    @IsString()
    username: string;

    @ApiProperty({
        description: "Email"
    })
    @IsString()
    email: string;

    @ApiProperty({
        description: "Password"
    })
    @IsString()
    password: string;

}