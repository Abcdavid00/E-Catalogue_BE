import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class SignInDto {
    @ApiProperty({
        description: "Username or Email"
    })
    @IsString()
    username: string;

    @ApiProperty({
        description: "Password"
    })
    @IsString()
    password: string;
}