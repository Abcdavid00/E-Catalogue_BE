import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, IsEnum } from 'class-validator';

export enum Sex {
    MALE = 'male',
    FEMALE = 'female',
    UNKNOWN = 'unknown',
}

export type UserInfo = {
    id: number;
    fullname?: string;
    phone?: string;
    sex?: Sex;
    dob?: Date;
    profile_image?: string; 
}

export class UserInfoDto {
    @ApiProperty({
        description: "Id of the user",
    })
    @IsNumber()
    id: number;

    @ApiProperty({
        description: "Fullname of the user"
    })
    @IsString()
    fullname?: string;

    @ApiProperty({
        description: "Phone number of the user"
    })
    @IsString()
    phone?: string;

    @ApiProperty({
        description: "Sex of the user",
        enum: Sex,
        default: Sex.UNKNOWN
    })
    @IsEnum(Sex)
    sex?: Sex;

    @ApiProperty({
        description: "Date of birth of the user",
        type: Date,
    })
    dob?: Date;

    @ApiProperty({
        description: "Profile image of the user",
    })
    @IsString()
    profile_image?: string;


}