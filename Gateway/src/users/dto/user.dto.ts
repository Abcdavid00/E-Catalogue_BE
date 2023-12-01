import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNumber, IsString } from "class-validator";

export enum UserRole {
    ADMIN = 'admin',
    SHOP_OWNER = 'shop_owner',
    CUSTOMER = 'customer',
}

export type User = {
    id: number;
    username: string;
    email: string;
    password: string;
    role: UserRole;
}

export class UserDto {

    @ApiProperty({
        description: "Id of the user"
    })
    @IsNumber()
    id: number;

    @ApiProperty({
        description: "Username of the user"
    })
    @IsString()
    username: string;

    @ApiProperty({
        description: "Email of the user"
    })
    @IsString()
    email: string;

    @ApiProperty({
        description: "Role of the user",
        enum: UserRole,
        default: UserRole.CUSTOMER,
    })
    @IsEnum(UserRole)
    role: UserRole;

    constructor(user: User) {
        this.id = user.id;
        this.username = user.username;
        this.email = user.email;
        this.role = user.role;
    }

}