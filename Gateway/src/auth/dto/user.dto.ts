import { ApiProperty } from "@nestjs/swagger";

export class UserDto {
    @ApiProperty({
        description: "User's ID",
        type: String
    })
    id: number;

    @ApiProperty({
        description: "User's Username",
        type: String
    })
    username: string;

    @ApiProperty({
        description: "User's Role",
        type: String
    })
    role: string;
}