import { Controller, Get, Inject, Param, Post, UseGuards, Request, Body, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UserInfoMsService } from './user-info-ms.service';
import { UserInfo, UserInfoDto } from './dto/user-info.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user-info')
export class UserInfoMsController {
    constructor(
        private readonly userInfoMsService: UserInfoMsService
    ) {}

    @Get(':id')
    @ApiOperation({ summary: 'Get user info' })
    @ApiTags('User Info')
    @ApiParam({ name: 'id', type: Number })
    @ApiOkResponse({ type: UserInfoDto })
    async getUserInfo(@Param('id' )id: number): Promise<UserInfo> {
        return this.userInfoMsService.getUserInfo(id);
    }

    @Post()
    @ApiOperation({ summary: 'Create user info' })
    @ApiTags('User Info')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiBody({ type: UserInfoDto })
    @ApiOkResponse({ type: UserInfoDto })
    async updateUserInfo(@Request() req, @Body() userInfo: UserInfo): Promise<UserInfo> {
        const id = req.user.id;
        return this.userInfoMsService.updateUserInfo(id, userInfo);
    }

    @Post('profile-image')
    @ApiOperation({ summary: 'Set profile image' })
    @ApiTags('User Info')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @UseInterceptors(FileInterceptor('image'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({ 
        schema: {
            type: 'object',
            properties: {
                image: {
                    type: 'string',
                    format: 'binary'
                }
            }
        }
    })
    @ApiOkResponse({ type: UserInfoDto })
    async setProfileImage(@Request() req, @UploadedFile() image: Express.Multer.File): Promise<UserInfo> {
        const id = req.user.id;
        return this.userInfoMsService.setProfileImage(id, image);
    }

}
