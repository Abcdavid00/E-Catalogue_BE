import { Controller, Post, Get, Body, UploadedFile, UseInterceptors, Param, Delete } from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiParam, ApiBody, ApiConsumes, ApiOkResponse } from '@nestjs/swagger';
import { CategoriesDto } from './dto/category.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductDto } from './dto/product.dto';

@Controller('product')
export class ProductController {
    constructor(
        private readonly productService: ProductService
    ) { }

    @Post('category')
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
    async createCategory(@Body() param: {
        name: string,
        description?: string,
        parent?: number,
    }, @UploadedFile() image: Express.Multer.File): Promise<any> {
        console.log(JSON.stringify(param));
        return this.productService.createCategory(param, image);
    }

    @Get('category')
    @ApiOkResponse({ type: [CategoriesDto] })
    async getAllCategories(): Promise<any> {
        return this.productService.getAllCategories();
    }

    @Get('category/:id')
    @ApiParam({ name: 'id', type: Number })
    @ApiOkResponse({ type: CategoriesDto })
    async getCategoryById(@Param('id') id: number): Promise<any> {
        return this.productService.getCategoryById(id);
    }

    @Post()
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
    }, @UploadedFile() image: Express.Multer.File): Promise<ProductDto> {
        return this.productService.createProduct({
            name: param.name,
            description: param.description,
            category: param.category,
            image: image
        });
    }

    @Get(':id')
    @ApiParam({ name: 'id', type: Number })
    @ApiOkResponse({ type: ProductDto })
    async getProductById(@Param('id') id: number): Promise<any> {
        return this.productService.getProductById(id);
    }

    @Delete(':id')
    @ApiParam({ name: 'id', type: Number })
    @ApiOkResponse({ type: ProductDto })
    async removeProductById(@Param('id') id: number): Promise<any> {
        return this.productService.removeProductById(id);
    }

    @Post('variant/:product/:size/:color')
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
    @ApiParam({ name: 'product', type: Number })
    @ApiParam({ name: 'size', type: String })
    @ApiParam({ name: 'color', type: String })
    async setProductVariant(@Param('product') product: number, @Param('size') size: string, @Param('color') color: string, @Body() param: {
        price?: number,
        quantity?: number,
    }, @UploadedFile() image: Express.Multer.File): Promise<any> {
        return this.productService.setProductVariant({
            product: product,
            size: size,
            color: color,
            price: param.price,
            quantity: param.quantity,
            image: image
        });
    }

    @Get('variant/:productId/:size/:color')
    @ApiParam({ name: 'productId', type: Number })
    @ApiParam({ name: 'size', type: String })
    @ApiParam({ name: 'color', type: String })
    // @ApiOkResponse({ type: ProductDto })
    async getProductVariant(@Param('productId') productId: number, @Param('size') size: string, @Param('color') color: string): Promise<any> {
        return this.productService.getProductVariant({
            productId: productId,
            size: size,
            color: color
        });
    }

    @Delete('variant/:productId/:size/:color')
    @ApiParam({ name: 'productId', type: Number })
    @ApiParam({ name: 'size', type: String })
    @ApiParam({ name: 'color', type: String })
    // @ApiOkResponse({ type: ProductDto })
    async removeProductVariant(@Param('productId') productId: number, @Param('size') size: string, @Param('color') color: string): Promise<any> {
        return this.productService.removeProductVariant({
            productId: productId,
            size: size,
            color: color
        });
    }
}
