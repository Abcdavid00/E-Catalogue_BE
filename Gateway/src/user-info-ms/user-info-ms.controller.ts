import { Controller, Get, Inject, Param, Post, UseGuards, Request, Body, UploadedFile, UseInterceptors, Query, Put, BadRequestException, UnauthorizedException, Delete } from '@nestjs/common';
import { UserInfoMsService } from './user-info-ms.service';
import { UserInfo, UserInfoDto } from './dto/user-info.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user-info')
export class UserInfoMsController {
    constructor(
        private readonly userInfoMsService: UserInfoMsService
    ) {}

    @Get()
    @ApiOperation({ summary: 'Get user info' })
    @ApiTags('User Info')
    @ApiQuery({ name: 'id', type: Number })
    @ApiOkResponse({ type: UserInfoDto })
    async getUserInfo(@Query('id' )id: number): Promise<UserInfo> {
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

    @Post('collection')
    @ApiOperation({ summary: 'Create collection (User required)' })
    @ApiTags('Favorite')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @UseInterceptors(FileInterceptor('image'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({ 
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                image: {
                    type: 'string',
                    format: 'binary'
                }
            }
        }
    })
    async createCollection(@Request() req, @Body() body: {name: string}, @UploadedFile() image: Express.Multer.File): Promise<any> {
        const userId = req.user.id;

        const collection = await this.userInfoMsService.createCollection({
            userId,
            name: body.name,
            image
        });
        return collection;
    }

    @Put('collection')
    @ApiOperation({ summary: 'Update collection (User required)' })
    @ApiTags('Favorite')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @UseInterceptors(FileInterceptor('image'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({ 
        schema: {
            type: 'object',
            properties: {
                id: { type: 'number' },
                name: { type: 'string' },
                image: {
                    type: 'string',
                    format: 'binary'
                }
            }
        }
    })
    async updateCollection(@Request() req, @Body() body: {id: number, name?: string}, @UploadedFile() image?: Express.Multer.File): Promise<any> {
        const userId = req.user.id;

        const collection = await this.userInfoMsService.updateCollection({
            id: body.id,
            name: body.name,
            image: image,
        });
        return collection;
    }

    @Delete('collection')
    @ApiOperation({ summary: 'Delete collection (User required)' })
    @ApiTags('Favorite')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiQuery({ name: 'id', type: Number })
    async deleteCollection(@Request() req, @Query('id') id: number): Promise<any> {
        const userId = req.user.id;

        const collection = await this.userInfoMsService.deleteCollection({
            id,
        });
        return collection;
    }

    @Get('collection')
    @ApiOperation({ summary: 'Get collection' })
    @ApiTags('Favorite')
    @ApiQuery({ name: 'id', type: Number })
    async getCollection(@Query('id') id: number): Promise<any> {
        const collection = await this.userInfoMsService.getCollection({
            id,
        });
        return collection;
    }

    @Get('collections')
    @ApiOperation({ summary: 'Get collections by user (User required)' })
    @ApiTags('Favorite')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async getCollectionsByUser(@Request() req): Promise<any> {
        const userId = req.user.id;

        const collections = await this.userInfoMsService.getCollectionsByUser({
            userId,
        });
        return collections;
    }

    @Post('favorite')
    @ApiOperation({ summary: 'Add favorite (User required)' })
    @ApiTags('Favorite')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiBody({ schema: {
        type: 'object',
        properties: {
            contentId: { type: 'number' },
            contentType: { type: 'string' },
            collectionId: { type: 'number' },
        }
    } })
    async addFavorite(@Request() req, @Body() body: {contentId: number, contentType: string, collectionId: number}): Promise<any> {
        const userId = req.user.id;

        const favorite = await this.userInfoMsService.addFavorite({
            userId,
            contentId: body.contentId,
            contentType: body.contentType,
            collectionId: body.collectionId,
        });
        return favorite;
    }

    @Delete('favorite')
    @ApiOperation({ summary: 'Remove favorite (User required)' })
    @ApiTags('Favorite')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiQuery({ name: 'id', type: Number })
    async removeFavorite(@Request() req, @Query('id') id: number): Promise<any> {
        const userId = req.user.id;

        const favorite = await this.userInfoMsService.removeFavorite({
            id,
        });
        return favorite;
    }

    @Get('favorite')
    @ApiOperation({ summary: 'Get favorite' })
    @ApiTags('Favorite')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiQuery({ name: 'collectionId', type: Number })
    @ApiQuery({ name: 'contentId', type: Number })
    @ApiQuery({ name: 'contentType', type: String })
    async getFavorite(@Request() req, @Query('collectionId') collectionId: number, @Query('contentId') contentId: number, @Query('contentType') contentType: string): Promise<any> {
        const userId = req.user.id;

        const favorite = await this.userInfoMsService.getFavorite({
            userId,
            collectionId,
            contentId,
            contentType,
        });
        return favorite;
    }

    @Get('user/follow')
    @ApiOperation({ summary: 'Get store follow by user (User required)' })
    @ApiTags('Store Follower')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async getStoreFollowByUser(@Request() req): Promise<any> {
        const userId = req.user.id;

        const storeFollowers = await this.userInfoMsService.getStoreFollowByUser({
            userId,
        });
        return storeFollowers;
    }

    @Get('store/follow')
    @ApiOperation({ summary: 'Get store follow by store' })
    @ApiTags('Store Follower')
    @ApiQuery({ name: 'storeId', type: Number })
    async getStoreFollowByStore(@Query('storeId') storeId: number): Promise<any> {
        const storeFollowers = await this.userInfoMsService.getStoreFollowByStore({
            storeId,
        });
        return storeFollowers;
    }

    @Post('store/follow')
    @ApiOperation({ summary: 'Set store follow (User required)' })
    @ApiTags('Store Follower')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiBody({ schema: {
        type: 'object',
        properties: {
            storeId: { type: 'number' },
            follow: { type: 'boolean' },
        }
    } })
    async setStoreFollow(@Request() req, @Body() body: {storeId: number, follow: boolean}): Promise<any> {
        const userId = req.user.id;

        const storeFollowers = await this.userInfoMsService.setStoreFollow({
            userId: userId,
            storeId: body.storeId,
            follow: body.follow,
        });
        return storeFollowers;
    }


}
