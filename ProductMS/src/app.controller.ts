import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import { Category } from './entities/category.entity';
import { Product } from './entities/product.entity';

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
}
