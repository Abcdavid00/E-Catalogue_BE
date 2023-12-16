import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { DeepPartial, EntityManager, IsNull, Repository, TreeRepository } from 'typeorm';
import { Category } from './entities/category.entity';
import { Brand } from './entities/brand.entity';
import { ProductImage } from './entities/product-image.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { RpcException } from '@nestjs/microservices';
import { mysqlConfig } from './config/mysql.module';

@Injectable()
export class AppService {

  // private readonly categoryTreeRepository: TreeRepository<Category>;

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryTreeRepository: TreeRepository<Category>,
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
    @InjectRepository(ProductVariant)
    private readonly productVariantRepository: Repository<ProductVariant>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    @InjectEntityManager(mysqlConfig)
    private readonly entityManager: EntityManager
  ) {
    // this.categoryTreeRepository = entityManager.getTreeRepository(Category);
  }

  getHello(): string {
    return 'ProductMS Online!';
  }

  async createCategory(param: {
    name: string,
    description?: string,
    parent?: number,
    image?: string
  }): Promise<Category> {
    let parent = null;
    if (param.parent) {
      console.log("Parent:", param.parent)
      parent = await this.categoryTreeRepository.findOne({
        where: {
          id: param.parent,
        }
      });
      console.log(JSON.stringify(parent, null, 2))
      if (!parent) {
        throw new RpcException('Parent category not found');
      }
    }
    const cat: DeepPartial<Category> = this.categoryTreeRepository.create({
      name: param.name,
      description: param.description,
      parent: parent,
      image: param.image
    });
    console.log(JSON.stringify(param, null, 2));
    return await this.categoryTreeRepository.save(cat);
  }

  async getAllCategories(): Promise<Category[]> {

    const res = await this.categoryTreeRepository.findTrees();
    console.log(JSON.stringify(res, null, 2));
    return res;
  }

  async getCategoryById(id: number): Promise<Category> {
    console.log("ID:", id)
    const cat = await this.categoryTreeRepository.findOne({
      where: {
        id: id
      },
      relations: [
        'products',
      ]
    });
    if (!cat) {
      throw new RpcException('Category not found');
    }
    return cat;
  }

  async createProduct(param: {
    name: string,
    description?: string,
    category: number,
    image: string
  }): Promise<Product> {
    const cat = await this.categoryTreeRepository.findOne({
      where: {
        id: param.category
      }
    });
    if (!cat) {
      throw new RpcException('Category not found');
    }
    const product: Product = this.productRepository.create({
      name: param.name,
      description: param.description,
      category: cat,
      image: param.image
    });
    return await this.productRepository.save(product);
  }

  async getProductById(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: {
        id: id
      },
      relations: [
        'category',
        'variants',
        'images'
      ]
    });
    if (!product) {
      throw new RpcException('Product not found');
    }
    return product;
  }

  async removeProductById(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: {
        id: id
      }
    });
    if (!product) {
      throw new RpcException('Product not found');
    }
    return await this.productRepository.remove(product);
  }

  async createProductVariant(param: {
    product: number,
    name?: string,
    image?: string,
    price: number,
    quantity: number
  }): Promise<ProductVariant> {
    const product = await this.productRepository.findOne({
      where: {
        id: param.product
      }
    });
    if (!product) {
      throw new RpcException('Product not found');
    }
    const variant: ProductVariant = this.productVariantRepository.create({
      product: product,
      name: param.name,
      image: param.image,
      price: param.price,
      quantity: param.quantity
    });
    return await this.productVariantRepository.save(variant);
  }

  async updateProductVariant(param: {
    id: number,
    name?: string,
    image?: string,
    price?: number,
    quantity?: number
  }): Promise<ProductVariant> {
    const variant = await this.productVariantRepository.findOne({
      where: {
        id: param.id
      }
    });
    if (!variant) {
      throw new RpcException('Variant not found');
    }
    variant.name = param.name || variant.name;
    variant.image = param.image || variant.image;
    variant.price = param.price || variant.price;
    variant.quantity = param.quantity || variant.quantity;
    return await this.productVariantRepository.save(variant);
  }

  async deleteProductVariant(id: number): Promise<ProductVariant> {
    const variant = await this.productVariantRepository.findOne({
      where: {
        id: id
      }
    });
    if (!variant) {
      throw new RpcException('Variant not found');
    }
    return await this.productVariantRepository.remove(variant);
  }
}
