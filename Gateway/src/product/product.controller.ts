import { Controller, Post, Get, Body, UploadedFile, UseInterceptors, Param } from '@nestjs/common';
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
}
