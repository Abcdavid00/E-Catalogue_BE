import { ApiProperty } from "@nestjs/swagger";

export class TokensDto {
    @ApiProperty({
        description: "Access Token",
        type: String
    })
    access_token: string;

    @ApiProperty({
        description: "Refresh Token",
        type: String
    })
    refresh_token: string;
}