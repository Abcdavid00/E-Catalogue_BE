import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import { Category } from './entities/category.entity';
import { Product } from './entities/product.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { Size } from './entities/size.enum';
import { Color } from './entities/color.enum';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @MessagePattern({ cmd: 'Hi' })
  ping(_: any): string {
    return this.appService.getHello();
  }

  @MessagePattern({ cmd: 'CreateCategory' })
  createCategory(param: {
    name: string,
    description?: string,
    parent?: number,
    image?: string
  }): Promise<any> {
    return this.appService.createCategory(param);
  }

  @MessagePattern({ cmd: 'GetAllCategories' })
  getAllCategories(_: any): Promise<Category[]> {
    return this.appService.getAllCategories();
  }

  @MessagePattern({ cmd: 'GetCategoryById' })
  getCategoryById(param: {id: number}): Promise<Category> {
    return this.appService.getCategoryById(param.id);
  }

  @MessagePattern({ cmd: 'CreateProduct' })
  createProduct(param: {
    name: string,
    description?: string,
    category: number,
    image: string
  }): Promise<Product> {
    return this.appService.createProduct(param);
  }

  @MessagePattern({ cmd: 'GetProductById' })
  getProductById(param: {id: number}): Promise<any> {
    return this.appService.getProductById(param.id);
  }

  @MessagePattern({ cmd: 'RemoveProductById' })
  removeProductById(param: {id: number}): Promise<any> {
    return this.appService.removeProductById(param.id);
  }

  @MessagePattern({ cmd: 'SetProductVariant' })
  setProductVariant(param: {
    product: number,
    size: string,
    color: string,
    image?: string,
    price?: number,
    quantity?: number,
  }): Promise<ProductVariant> {
    return this.appService.setProductVariant(param);
  }

  @MessagePattern({ cmd: 'GetProductVariant' })
  getProductVariant(param: {productId: number, size: string, color: string}): Promise<ProductVariant> {
    return this.appService.getProductVariant(param);
  }

  @MessagePattern({ cmd: 'RemoveProductVariant' })
  removeProductVariant(param: {productId: number, size: string, color: string}): Promise<ProductVariant> {
    return this.appService.removeProductVariant(param);
  }
}
