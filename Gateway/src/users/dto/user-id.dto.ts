import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class UserIdDto {
    @ApiProperty({
        description: "Id of the user"
    })
    @IsNumber()
    id: string;
}