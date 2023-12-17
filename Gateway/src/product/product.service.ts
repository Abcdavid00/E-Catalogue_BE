import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ProductMSName } from 'src/config/microservices.module';
import { FileServerService } from 'src/file-server/file-server.service';
import { ProductDto } from './dto/product.dto';

type File = Express.Multer.File

@Injectable()
export class ProductService {
    constructor(
        @Inject(ProductMSName)
        private readonly productClient: ClientProxy,
        private readonly fileServerService: FileServerService
    ) {}

    async send(param: {
        cmd: string,
        data: any
    }): Promise<any> {
        try {
            const res: any = await firstValueFrom(
                this.productClient.send<any>({ cmd: param.cmd }, param.data)
            )
            return res;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async createCategory(param: {
        name: string,
        description?: string,
        parent?: number,
    }, image: File): Promise<any> {
        let imageId = null;
        if (image) {
            imageId = await this.fileServerService.uploadImage(image as File);
        }
        const payload = {
            name: param.name,
            description: param.description,
            parent: param.parent,
            image: imageId
        }
        console.log("Payload:", JSON.stringify(payload, null, 2) )
        return this.send({
            cmd: 'CreateCategory',
            data: payload
        })
    }

    async getAllCategories(): Promise<any> {
        return this.send({
            cmd: 'GetAllCategories',
            data: {}
        })
    }

    async getCategoryById(id: number): Promise<any> {
        return this.send({
            cmd: 'GetCategoryById',
            data: { id }
        })
    }

    async createProduct(param: {
        name: string,
        description?: string,
        category: number,
        image: Express.Multer.File
    }): Promise<ProductDto> {
        if (!param.image) {
            throw new BadRequestException('Image is required');
        }
        const imageId = await this.fileServerService.uploadImage(param.image);
        return this.send({
            cmd: 'CreateProduct',
            data: {
                name: param.name,
                description: param.description,
                category: param.category,
                image: imageId
            }
        })
    }

    async getProductById(id: number): Promise<ProductDto> {
        return this.send({
            cmd: 'GetProductById',
            data: { id }
        })
    }

    async removeProductById(id: number): Promise<any> {
        return this.send({
            cmd: 'RemoveProductById',
            data: { id }
        })
    }

    async setProductVariant(param: {
        product: number,
        size: string,
        color: string,
        price: number,
        quantity: number,
        image: Express.Multer.File
    }): Promise<any> {
        let image: string = null;
        if (param.image) {
            image = await this.fileServerService.uploadImage(param.image);
        }
        return this.send({
            cmd: 'SetProductVariant',
            data: {
                product: param.product,
                size: param.size,
                color: param.color,
                price: param.price,
                quantity: param.quantity,
                image
            }
        })
    }

    async getProductVariant(param: {
        productId: number,
        size: string,
        color: string
    }): Promise<any> {
        return this.send({
            cmd: 'GetProductVariant',
            data: {
                productId: param.productId,
                size: param.size,
                color: param.color
            }
        })
    }

    async removeProductVariant(param: {
        productId: number,
        size: string,
        color: string
    }): Promise<any> {
        return this.send({
            cmd: 'RemoveProductVariant',
            data: {
                productId: param.productId,
                size: param.size,
                color: param.color
            }
        })
    }
}