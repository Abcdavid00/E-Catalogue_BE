import { BadRequestException, Body, Catch, ConflictException, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersMSName } from 'src/config/microservices.module';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ApiBadGatewayResponse, ApiBadRequestResponse, ApiBody, ApiDefaultResponse, ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { User, UserDto } from './dto/user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { SignInDto } from './dto/sign-in.dto';

@Controller('users')
export class UsersController {

    constructor(
        private readonly UsersService: UsersService
    ) {}

    @Get('username_availability/:username')
    @ApiParam({ type: String, name: "username", description: "User's Username" })
    @ApiOkResponse({ type: Boolean, description: 'Returns true if username is available' })
    async isUsernameAvailable(@Param('username') username: string): Promise<Boolean> {
        return this.UsersService.isUsernameAvailable(username);
    }

    @Get('email_availability/:email')
    @ApiParam({ type: String, name: "email", description: "User's Email" })
    @ApiOkResponse({ type: Boolean, description: 'Returns true if email is available' })
    async isEmailAvailable(@Param('email') email: string): Promise<Boolean> {
        return this.UsersService.isEmailAvailable(email);
    }

    @Post('createuser')
    @ApiBody({ type: CreateUserDto })
    @ApiOkResponse({ type: UserDto })
    async createUser(@Body() user: CreateUserDto): Promise<UserDto> {
        return this.UsersService.createUser(user.username, user.email, user.password);
    }

    @Get(':id')
    @ApiParam({ type: Number, name: 'id', description: "User's Id"})
    @ApiOkResponse({ type: UserDto })
    async getUser(@Param('id') id: number): Promise<UserDto> {
        return this.UsersService.getUser(id);
    }

    @Get('username/:username')
    @ApiParam({ type: String, name: "username", description: "User's Username" })
    @ApiOkResponse({ type: UserDto })
    async findUserByUsername(@Param('username') username: string): Promise<UserDto> {
        return this.UsersService.findUserByUsername(username);
    }

    @Get('email/:email')
    @ApiParam({ type: String, name: "email", description: "User's Email" })
    @ApiOkResponse({ type: UserDto })
    async findUserByEmail(@Param('email') email: string): Promise<UserDto> {
        return this.UsersService.findUserByEmail(email);
    }

    // @Post('signin')
    // @ApiBody({ type: SignInDto })
    // @ApiOkResponse({ type: UserDto })
    // async signIn(@Body() user: SignInDto): Promise<UserDto> {
    //     return this.UsersService.signIn(user.username, user.password);
    // }


}
