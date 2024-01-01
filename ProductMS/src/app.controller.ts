import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import { Category } from './entities/category.entity';
import { Product } from './entities/product.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { Store } from './entities/store.entity';

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

  @MessagePattern({ cmd: 'EditCategory' })
  editCategory(param: {
    id: number,
    name?: string,
    description?: string,
    parent?: number,
    image?: string
  }): Promise<Category> {
    return this.appService.editCategory(param);
  }

  @MessagePattern({ cmd: 'RegisterStore' })
  registerStore(param: {
    id: number,
    name: string,
    description?: string,
    address?: number,
    logo?: string,
    cover?: string
  }): Promise<Store> {
    return this.appService.registerStore(param);
  }

  @MessagePattern({ cmd: 'GetStoreById' })
  getStoreById(param: {id: number}): Promise<Store> {
    return this.appService.getStoreById(param.id);
  }

  @MessagePattern({ cmd: 'GetAllUnapprovedStores' })
  getAllUnapprovedStores(): Promise<Store[]> {
    return this.appService.getAllUnapprovedStores();
  }

  @MessagePattern({ cmd: 'GetAllApprovedStores' })
  getAllApprovedStores(): Promise<Store[]> {
    return this.appService.getAllApprovedStores();
  }

  @MessagePattern({ cmd: 'ApproveStore' })
  approveStore(param: {id: number}): Promise<Store> {
    return this.appService.approveStore(param.id);
  }

  @MessagePattern({ cmd: 'StoreHas' })
  storeHas(param: {storeId: number, productId: number}): Promise<boolean> {
    return this.appService.storeHas(param);
  }

  @MessagePattern({ cmd: 'UpdatePriceForAllProducts' })
  updatePriceForAllProducts(): Promise<void> {
    return this.appService.updatePriceForAllProducts();
  }

  @MessagePattern({ cmd: 'CreateProduct' })
  createProduct(param: {
    name: string,
    description?: string,
    store: number,
    category: number,
    image: string
  }): Promise<Product> {
    return this.appService.createProduct(param);
  }

  @MessagePattern({ cmd: 'GetProductById' })
  getProductById(param: {id: number}): Promise<any> {
    return this.appService.getProductById(param.id);
  }

  @MessagePattern({ cmd: 'EditProduct' })
  editProduct(param: {
    id: number,
    name?: string,
    description?: string,
    category?: number,
    image?: string
  }): Promise<Product> {
    return this.appService.editProduct(param);
  }

  @MessagePattern({ cmd: 'AddImageToProduct' })
  addImageToProduct(param: {
    product: number,
    images: string[]
  }): Promise<Product> {
    return this.appService.addImageToProduct(param);
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

  @MessagePattern({ cmd: 'GetProductVariantById' })
  getProductVariantById(param: {id: number}): Promise<ProductVariant> {
    return this.appService.getProductVariantById(param);
  }

  @MessagePattern({ cmd: 'GetProductVariant' })
  getProductVariant(param: {productId: number, size: string, color: string}): Promise<ProductVariant> {
    return this.appService.getProductVariant(param);
  }

  @MessagePattern({ cmd: 'RemoveProductVariant' })
  removeProductVariant(param: {productId: number, size: string, color: string}): Promise<ProductVariant> {
    return this.appService.removeProductVariant(param);
  }

  @MessagePattern({ cmd: 'GetProducts' })
  getProducts(param: {ids: number[]}): Promise<Product[]> {
    return this.appService.getProducts(param);
  }

  @MessagePattern({ cmd: 'GetProductVariants' })
  getProductVariants(param: {ids: number[]}): Promise<ProductVariant[]> {
    return this.appService.getProductVariants(param);
  }

  @MessagePattern({ cmd: 'CreateStyle' })
  createStyle(param: {
    name: string,
    category: string,
    store: number,
    mainImage: string,
    width: number,
    height: number,
    rectangles: [{
      minX: number,
      minY: number,
      maxX: number,
      maxY: number,
      variant: number
    }],
  }): Promise<any> {
    return this.appService.createStyle(param);
  }

  @MessagePattern({ cmd: 'UpdateStyle' })
  updateStyle(param: {
    id: number,
    name?: string,
    category?: string,
    mainImage?: string,
    width?: number,
    height?: number,
    rectangles?: {
      id?: number,
      minX: number,
      minY: number,
      maxX: number,
      maxY: number,
      variant: number
    }[]
  }): Promise<any> {
    return this.appService.updateStyle(param);
  }

  @MessagePattern({ cmd: 'AddImageToStyle' })
  addImageToStyle(param: {
    style: number,
    image: string
  }): Promise<any> {
    return this.appService.addImageToStyle(param);
  }

  @MessagePattern({ cmd: 'RemoveImageFromStyle' })
  removeImageFromStyle(param: {
    style: number,
    image: string
  }): Promise<any> {
    return this.appService.removeImageFromStyle(param);
  }

  @MessagePattern({ cmd: 'GetStyleById' })
  getStyleById(param: {id: number}): Promise<any> {
    return this.appService.getStyleById(param);
  }

  @MessagePattern({ cmd: 'RemoveStyleById' })
  removeStyleById(param: {id: number}): Promise<any> {
    return this.appService.removeStyleById(param);
  }

  @MessagePattern({ cmd: 'GetStylesByStore' })
  getStylesByStore(param: {storeId: number}): Promise<any> {
    return this.appService.getStylesByStore(param);
  }

  @MessagePattern({ cmd: 'GetStylesByCategory' })
  getStylesByCategory(param: {category: string}): Promise<any> {
    return this.appService.getStylesByCategory(param);
  }

  @MessagePattern({ cmd: 'FilterProducts' })
  filterProducts(param: {
    name?: string,
    colors?: string[],
    sizes?: string[],
    minPrice?: number,
    maxPrice?: number,
  }): Promise<any> {
    return this.appService.filterProducts(param);
  }
}
