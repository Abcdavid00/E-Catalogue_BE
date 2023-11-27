import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersMSName } from 'src/config/microservices.module';
import { ClientProxy } from '@nestjs/microservices';
import { UsernameDto } from './dto/username.dto';
import { BooleanDto } from './dto/boolean.dto';
import { firstValueFrom } from 'rxjs';
import { ApiBody, ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { User, UserDto } from './dto/user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UserIdDto } from './dto/user-id.dto';
import { EmailDto } from './dto/email.dto';
import { SignInDto } from './dto/sign-in.dto';

@Controller('users')
export class UsersController {

    constructor(
        @Inject(UsersMSName)
        private readonly UsersClient: ClientProxy
    ) {}

    @Get('isusernameavailable/:username')
    @ApiParam({ type: String, name: "username", description: "User's Username" })
    @ApiOkResponse({ type: BooleanDto })
    async isUsernameAvailable(@Param('username') username: string): Promise<BooleanDto> {
        console.log('Looking for username: ', username)
        const res: boolean =  await firstValueFrom(
            this.UsersClient.send<boolean>({ cmd: 'isUsernameAvailable' }, {username})
        )
        return { value: res };
    }

    @Get('isemailavailable/:email')
    @ApiParam({ type: String, name: "email", description: "User's Email" })
    @ApiOkResponse({ type: BooleanDto })
    async isEmailAvailable(@Param('email') email: string): Promise<BooleanDto> {
        const res: boolean =  await firstValueFrom(
            this.UsersClient.send<boolean>({ cmd: 'isEmailAvailable' }, email)
        )
        return { value: res };
    }

    @Post('createuser')
    @ApiBody({ type: CreateUserDto })
    @ApiOkResponse({ type: UserDto })
    async createUser(@Body() user: CreateUserDto): Promise<UserDto> {
        console.log('Creating user: ', JSON.stringify(user));
        const res: User = await firstValueFrom(
            this.UsersClient.send<User>({ cmd: 'createUser' }, {
                username: user.username,
                email: user.email,
                password: user.password,
            })
        );
        return {
            id: res.id,
            username: res.username,
            email: res.email,
            role: res.role,
        };
    }

    @Get(':id')
    @ApiParam({ type: Number, name: 'id', description: "User's Id"})
    @ApiOkResponse({ type: UserDto })
    async getUser(@Param('id') id: Number): Promise<UserDto> {
        const res: User = await firstValueFrom(
            this.UsersClient.send<User>({ cmd: 'getUser' }, id)
        );
        return {
            id: res.id,
            username: res.username,
            email: res.email,
            role: res.role,
        };
    }

    @Get('username/:username')
    @ApiParam({ type: String, name: "username", description: "User's Username" })
    @ApiOkResponse({ type: UserDto })
    async findUserByUsername(@Param('username') username: string): Promise<UserDto> {
        const res: User = await firstValueFrom(
            this.UsersClient.send<User>({ cmd: 'findUserByUsername' }, username)
        );
        return {
            id: res.id,
            username: res.username,
            email: res.email,
            role: res.role,
        };
    }

    @Get('email/:email')
    @ApiParam({ type: String, name: "email", description: "User's Email" })
    @ApiOkResponse({ type: UserDto })
    async findUserByEmail(@Param('email') email: string): Promise<UserDto> {
        const res: User = await firstValueFrom(
            this.UsersClient.send<User>({ cmd: 'findUserByEmail' }, email)
        );
        return {
            id: res.id,
            username: res.username,
            email: res.email,
            role: res.role,
        };
    }

    @Post('signin')
    @ApiBody({ type: SignInDto })
    @ApiOkResponse({ type: UserDto })
    async signIn(@Body() user: SignInDto): Promise<UserDto> {
        const res: User = await firstValueFrom(
            this.UsersClient.send<User>({ cmd: 'signIn' }, {
                username: user.username,
                password: user.password,
            })
        );
        return {
            id: res.id,
            username: res.username,
            email: res.email,
            role: res.role,
        };
    }
}
