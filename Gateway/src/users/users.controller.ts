import { BadRequestException, Body, Catch, ConflictException, Controller, Get, Inject, Param, Post, Put, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersMSName } from 'src/config/microservices.module';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ApiBadGatewayResponse, ApiBadRequestResponse, ApiBody, ApiDefaultResponse, ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { User, UserDto } from './dto/user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { SignInDto } from './dto/sign-in.dto';

const INIT_ADMIN_SECRET = process.env.INIT_ADMIN_SECRET;

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

    @Post('initadmin')
    @ApiBody({ schema: {
        type: 'object',
        properties: {
            secret: {
                type: 'string',
            }
        }
    }})
    @ApiOkResponse({ schema: {
        type: 'object',
        properties: {
            username: {
                type: 'string',
            },
            email: {
                type: 'string',
            },
            role: {
                type: 'string',
            },
            id: {
                type: 'number',
            },
            password: {
                type: 'string',
            }
        }
    } })
    async initAdmin(@Body() body: { secret: string }): Promise<UserDto> {
        if (!body.secret) {
            throw new BadRequestException('Init admin is disabled');
        }
        if (body.secret !== INIT_ADMIN_SECRET) {
            throw new BadRequestException('Invalid secret');
        }
        return this.UsersService.initAdmin();
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

    @Put('password')
    @ApiBody({ schema: {
        type: 'object',
        properties: {
            oldPassword: {
                type: 'string',
            },
            newPassword: {
                type: 'string',
            }
        }
    }})
    @ApiOkResponse({ type: UserDto })
    async changePassword(@Request() req, @Body() body: { oldPassword: string, newPassword: string }): Promise<UserDto> {
        return this.UsersService.changePassword(req.user.id, body.oldPassword, body.newPassword);
    }

    @Put('email')
    @ApiBody({ schema: {
        type: 'object',
        properties: {
            newEmail: {
                type: 'string',
            }
        }
    }})
    @ApiOkResponse({ type: UserDto })
    async changeEmail(@Request() req, @Body() body: { newEmail: string }): Promise<UserDto> {
        return this.UsersService.changeEmail(req.user.id, body.newEmail);
    }

}
