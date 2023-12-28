import { Controller, Post, Get, Body, UploadedFile, UseInterceptors, Param, Delete, UseGuards, Request, UploadedFiles, UnauthorizedException, Put, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiParam, ApiBody, ApiConsumes, ApiOkResponse, ApiProperty, ApiTags, ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CategoriesDto } from './dto/category.dto';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ProductDto } from './dto/product.dto';
import { UserRole } from 'src/users/dto/user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { StoreDto } from './dto/store.dto';

@Controller('product')
export class ProductController {
    constructor(
        private readonly productService: ProductService
    ) { }

    @Post('category')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Create a category (admin required)' })
    @ApiTags('Category', 'Admin')
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('image'))
    @ApiBody({ schema: {
        type: 'object',
        properties: {
            name: { type: 'string', nullable: false},
            description: { type: 'string', nullable: true},
            parent: { type: 'number', nullable: true},
            image: {
                type: 'string',
                format: 'binary',
                nullable: true
            }
        }
    }
    })
    @ApiCreatedResponse({ schema: {
        type: 'object',
        properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            description: { type: 'string' },
            parent: { type: 'number' },
            image: { type: 'string' },
        }
    } })
    async createCategory(@Body() param: {
        name: string,
        description?: string,
        parent?: number,
    }, @UploadedFile() image: Express.Multer.File): Promise<any> {
        console.log(JSON.stringify(param));
        return this.productService.createCategory(param, image);
    }

    @Get('category/all')
    @ApiOperation({ summary: 'Get all categories' })
    @ApiTags('Category')
    @ApiOkResponse({ type: [CategoriesDto] })
    async getAllCategories(): Promise<any> {
        return this.productService.getAllCategories();
    }

    @Get('category')
    @ApiOperation({ summary: 'Get category by id' })
    @ApiTags('Category')
    @ApiQuery({ name: 'id', type: Number })
    @ApiOkResponse({ type: CategoriesDto })
    async getCategoryById(@Query('id') id: number): Promise<any> {
        return this.productService.getCategoryById(id);
    }

    @Put('category')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Edit a category (admin required)' })
    @ApiTags('Category', 'Admin')
    @ApiQuery({ name: 'id', type: Number })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('image'))
    @ApiBody({ schema: {
        type: 'object',
        properties: {
            name: { type: 'string', nullable: true},
            description: { type: 'string', nullable: true},
            parent: { type: 'number', nullable: true},
            image: {
                type: 'string',
                format: 'binary',
                nullable: true
            }
        }
    }
    })
    @ApiOkResponse({ type: CategoriesDto })
    async editCategory(@Query('id') id: number, @Body() param: {
        name?: string,
        description?: string,
        parent?: number,
    }, @UploadedFile() image: Express.Multer.File): Promise<any> {
        return this.productService.editCategory({
            id: id,
            name: param.name,
            description: param.description,
            parent: param.parent,
            image: image
        });
    }
    
    @Post('store')
    @ApiOperation({ summary: 'Register a store (Become a store owner)' })
    @ApiTags('Store')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'logo', maxCount: 1 },
        { name: 'cover', maxCount: 1 }
    ]))
    @ApiBody({ schema: {
        type: 'object',
        properties: {
            name: { type: 'string', nullable: false},
            description: { type: 'string', nullable: true},
            address: { type: 'number', nullable: true},
            logo: {
                type: 'string',
                format: 'binary',
                nullable: true
            },
            cover: {
                type: 'string',
                format: 'binary',
                nullable: true
            }
        }
    }})
    async registerStore(@Body() param: {
        name: string,
        description?: string,
        address?: number,
    }, @UploadedFiles() files: {
        logo?: Express.Multer.File[],
        cover?: Express.Multer.File[]
    }, @Request() req): Promise<any> {
        const id = req.user.id;
        return this.productService.registerStore({
            id: id,
            name: param.name,
            description: param.description,
            address: param.address,
            logo: files.logo ? files.logo[0] : null,
            cover: files.cover ? files.cover[0] : null
        });
    }

    @Get('store/unapproved')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Get all unapproved stores (admin required)' })
    @ApiTags('Store', 'Admin')
    @ApiOkResponse({ type: [CategoriesDto] })
    async getAllUnapprovedStores(): Promise<StoreDto[]> {
        return this.productService.getAllUnapprovedStores();
    }

    @Get('store/all')
    @ApiOperation({ summary: 'Get all stores' })
    @ApiTags('Store')
    @ApiOkResponse({ type: [CategoriesDto] })
    async getAllStores(): Promise<StoreDto[]> {
        return this.productService.getAllApprovedStores();
    }

    @Get('store')
    @ApiOperation({ summary: 'Get store by id' })
    @ApiTags('Store')
    @ApiQuery({ name: 'id', type: Number })
    @ApiOkResponse({ type: CategoriesDto })
    async getStoreById(@Query('id') id: number): Promise<StoreDto> {
        return this.productService.getStoreById(id);
    }

    @Post('store/approve/')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Approve a store (admin required)' })
    @ApiTags('Store', 'Admin')
    @ApiQuery({ name: 'id', type: Number })
    @ApiOkResponse({ type: CategoriesDto })
    async approveStore(@Query('id') id: number): Promise<StoreDto> {
        console.log('approve store: ' + id)
        return this.productService.approveStore(id);
    }

    @Post()
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Create a product (store owner required)' })
    @ApiTags('Product', 'Store owner')
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('image'))
    @ApiBody({ schema: {
        type: 'object',
        properties: {
            name: { type: 'string', nullable: false},
            description: { type: 'string', nullable: true},
            category: { type: 'number', nullable: false},
            image: {
                type: 'string',
                format: 'binary',
                nullable: false
            }
        }
    }})
    @ApiOkResponse({ type: ProductDto })
    async createProduct(@Body() param: {
        name: string,
        description?: string,
        category: number,
    }, @UploadedFile() image: Express.Multer.File, @Request() req): Promise<ProductDto> {
        const id = req.user.id;
        return this.productService.createProduct({
            name: param.name,
            description: param.description,
            store: id,
            category: param.category,
            image: image
        });
    }

    @Get('')
    @ApiOperation({ summary: 'Get product by id' })
    @ApiTags('Product')
    @ApiQuery({ name: 'id', type: Number })
    @ApiOkResponse({ type: ProductDto })
    async getProductById(@Query('id') id: number): Promise<any> {
        return this.productService.getProductById(id);
    }

    @Put('')
    @ApiOperation({ summary: 'Edit a product (store owner required)' })
    @ApiTags('Product', 'Store owner')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('image'))
    @ApiBody({ schema: {
        type: 'object',
        properties: {
            name: { type: 'string', nullable: true},
            description: { type: 'string', nullable: true},
            category: { type: 'number', nullable: true},
            image: {
                type: 'string',
                format: 'binary',
                nullable: true
            }
        }
    }})
    @ApiQuery({ name: 'id', type: Number })
    @ApiOkResponse({ type: ProductDto })
    async editProduct(@Request() req, @Query('id') id: number, @Body() param: {
        name?: string,
        description?: string,
        category?: number,
    }, @UploadedFile() image: Express.Multer.File): Promise<any> {
        const storeId = req.user.id;
        if (!(await this.productService.storeHas({
            storeId: storeId,
            productId: id
        }))) {
            throw new UnauthorizedException('This product is not in your store');
        }
        return this.productService.editProduct({
            id: id,
            name: param.name,
            description: param.description,
            category: param.category,
            image: image
        });
    }

    @Post('image')
    @ApiOperation({ summary: 'Add images to a product (store owner required)' })
    @ApiTags('Product', 'Store owner')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FilesInterceptor('images'))
    @ApiBody({ schema: {
        type: 'object',
        properties: {
            images: {
                type: 'array',
                items: {
                    type: 'string',
                    format: 'binary',
                },
            }
        }
    }})
    @ApiQuery({ name: 'id', type: Number })
    @ApiOkResponse({ type: ProductDto })
    async addImageToProduct(@Request() req, @Query('id') id: number, @UploadedFiles() images: Array<Express.Multer.File>): Promise<any> {
        console.log("Images: " + images)
        const storeId = req.user.id;
        if (!(await this.productService.storeHas({
            storeId: storeId,
            productId: id
        }))) {
            throw new UnauthorizedException('This product is not in your store');
        }
        return this.productService.addImageToProduct({
            product: id,
            images: images
        });
    }

    @Delete('')
    @ApiOperation({ summary: 'Remove a product (store owner required)' })
    @ApiTags('Product', 'Store owner')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiQuery({ name: 'id', type: Number })
    @ApiOkResponse({ type: ProductDto })
    async removeProductById(@Request() req, @Query('id') id: number): Promise<any> {
        const storeId = req.user.id;
        if (!(await this.productService.storeHas({
            storeId: storeId,
            productId: id
        }))) {
            throw new UnauthorizedException('This product is not in your store');
        }
        return this.productService.removeProductById(id);
    }

    @Post('variant')
    @ApiOperation({ summary: 'Set a product variant (store owner required)' })
    @ApiTags('Product', 'Store owner')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('image'))
    @ApiBody({ schema: {
        type: 'object',
        properties: {
            price: { type: 'number', nullable: true},
            quantity: { type: 'number', nullable: true},
            image: {
                type: 'string',
                format: 'binary',
                nullable: true
            }
        }
    }})
    @ApiQuery({ name: 'product', type: Number })
    @ApiQuery({ name: 'size', type: String })
    @ApiQuery({ name: 'color', type: String })
    async setProductVariant(@Request() req, @Query('product') product: number, @Query('size') size: string, @Query('color') color: string, @Body() param: {
        price?: number,
        quantity?: number,
    }, @UploadedFile() image: Express.Multer.File): Promise<any> {
        const storeId = req.user.id;
        if (!(await this.productService.storeHas({
            storeId: storeId,
            productId: product
        }))) {
            throw new UnauthorizedException('This product is not in your store');
        }
        return this.productService.setProductVariant({
            product: product,
            size: size,
            color: color,
            price: param.price,
            quantity: param.quantity,
            image: image
        });
    }

    @Get('variant')
    @ApiOperation({ summary: 'Get a product variant' })
    @ApiTags('Product')
    @ApiQuery({ name: 'productId', type: Number })
    @ApiQuery({ name: 'size', type: String })
    @ApiQuery({ name: 'color', type: String })
    async getProductVariant(@Query('productId') productId: number, @Query('size') size: string, @Query('color') color: string): Promise<any> {
        return this.productService.getProductVariant({
            productId: productId,
            size: size,
            color: color
        });
    }

    @Delete('variant')
    @ApiOperation({ summary: 'Remove a product variant (store owner required)' })
    @ApiTags('Product', 'Store owner')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiQuery({ name: 'productId', type: Number })
    @ApiQuery({ name: 'size', type: String })
    @ApiQuery({ name: 'color', type: String })
    async removeProductVariant(@Request() req, @Query('productId') productId: number, @Query('size') size: string, @Query('color') color: string): Promise<any> {
        const storeId = req.user.id;
        if (!(await this.productService.storeHas({
            storeId: storeId,
            productId: productId
        }))) {
            throw new UnauthorizedException('This product is not in your store');
        }
        return this.productService.removeProductVariant({
            productId: productId,
            size: size,
            color: color
        });
    }

    @Get('cart')
    @ApiOperation({ summary: 'Get cart' })
    @ApiTags('Cart')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async getCart(@Request() req): Promise<any> {
        const id = req.user.id;
        return this.productService.getCartWithItems({
            id: id,
        });
    }
}
