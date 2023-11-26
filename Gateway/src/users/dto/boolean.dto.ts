import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean } from "class-validator";

export class BooleanDto {
    @ApiProperty({
        description: "Boolean value"
    })
    @IsBoolean()
    value: boolean;
}