import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { DeepPartial, EntityManager, In, IsNull, Repository, TreeRepository } from 'typeorm';
import { Category } from './entities/category.entity';
import { Brand } from './entities/brand.entity';
import { ProductImage } from './entities/product-image.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { RpcException } from '@nestjs/microservices';
import { mysqlConfig } from './config/mysql.module';
import { ParseSize, Size } from './entities/size.enum';
import { Color, ParseColor } from './entities/color.enum';
import { Store } from './entities/store.entity';
import { Style } from './entities/style.entity';
import { Rectangle } from './entities/rectangle.entity';
import { StyleImage } from './entities/style-image.entity';
import { parseStyleCategory } from './entities/style-category.enum';

@Injectable()
export class AppService {

  // private readonly categoryTreeRepository: TreeRepository<Category>;

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    @InjectRepository(Category)
    private readonly categoryTreeRepository: TreeRepository<Category>,
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
    @InjectRepository(ProductVariant)
    private readonly productVariantRepository: Repository<ProductVariant>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    @InjectEntityManager(mysqlConfig)
    private readonly entityManager: EntityManager,
    @InjectRepository(Style)
    private readonly styleRepository: Repository<Style>,
    @InjectRepository(Rectangle)
    private readonly rectangleRepository: Repository<Rectangle>,
    @InjectRepository(StyleImage)
    private readonly styleImageRepository: Repository<StyleImage>,
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

  async editCategory(param: {
    id: number,
    name?: string,
    description?: string,
    parent?: number,
    image?: string
  }): Promise<Category> {
    const cat = await this.categoryTreeRepository.findOne({
      where: {
        id: param.id
      }
    });
    if (!cat) {
      throw new RpcException('Category not found');
    }
    cat.name = param.name || cat.name;
    cat.description = param.description || cat.description;
    if (param.parent) {
      const parent = await this.categoryTreeRepository.findOne({
        where: {
          id: param.parent
        }
      });
      if (!parent) {
        throw new RpcException('Parent category not found');
      }
      cat.parent = parent;
    }
    cat.image = param.image || cat.image;
    return await this.categoryTreeRepository.save(cat);
  }

  async registerStore(param: {
    id: number,
    name: string,
    description?: string,
    address?: number,
    logo?: string,
    cover?: string
  }): Promise<Store> {
    const store: Store = this.storeRepository.create({
      id: param.id,
      name: param.name,
      description: param.description,
      address: param.address || 0,
      logo_image: param.logo,
      cover_image: param.cover,
      approved: false
    });
    return await this.storeRepository.save(store);
  }

  async getStoreById(id: number): Promise<Store> {
    const store = await this.storeRepository.findOne({
      where: {
        id: id
      },
      relations: {
        products: {
          category: true,
        }
      }
    });
    if (!store) {
      throw new RpcException('Store not found');
    }
    return store;
  }

  async getAllUnapprovedStores(): Promise<Store[]> {
    console.log("Getting all unapproved stores")
    return await this.storeRepository.find({
      where: {
        approved: false
      }
    });
  }

  async getAllApprovedStores(): Promise<Store[]> {
    return await this.storeRepository.find({
      where: {
        approved: true
      }
    });
  }

  async approveStore(id: number): Promise<Store> {
    const store = await this.storeRepository.findOne({
      where: {
        id: id
      }
    });
    if (!store) {
      throw new RpcException('Store not found');
    }
    store.approved = true;
    return await this.storeRepository.save(store);
  }

  async createProduct(param: {
    name: string,
    description?: string,
    store: number,
    category: number,
    image: string
  }): Promise<Product> {
    const [category, store ] = await Promise.all([
      this.categoryTreeRepository.findOne({
        where: {
          id: param.category
        }
      }),
      this.storeRepository.findOne({
        where: {
          id: param.store
        }
      })
    ]
    );
    if (!category) {
      throw new RpcException('Category not found');
    }
    if (!store) {
      throw new RpcException('Store not found');
    }
    const product: Product = this.productRepository.create({
      name: param.name,
      description: param.description,
      store: store,
      category: category,
      image: param.image
    });
    return await this.productRepository.save(product);
  }

  async getProductById(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: {
        id: id
      },
      relations: {
        category: true,
        variants: true,
        images: true,
        store: true
      }
    });
    if (!product) {
      throw new RpcException('Product not found');
    }
    return product;
  }

  async storeHas(param: {
    storeId: number,
    productId: number
  }): Promise<boolean> {
    const product = await this.productRepository.findOne({
      where: {
        id: param.productId,
        store: {
          id: param.storeId
        }
      },
      relations: {
        store: true
      }
    });
    console.log("Check store has product", param.storeId, param.productId)
    console.log("Product:", JSON.stringify(product, null, 2))
    if (!product) {
      throw new RpcException('Product not found');
    }
    return !!product;
  }

  async editProduct(param: {
    id: number,
    name?: string,
    description?: string,
    category?: number,
    image?: string
  }): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: {
        id: param.id
      }
    });
    if (!product) {
      throw new RpcException('Product not found');
    }
    product.name = param.name || product.name;
    product.description = param.description || product.description;
    if (param.category) {
      const category = await this.categoryTreeRepository.findOne({
        where: {
          id: param.category
        }
      });
      if (!category) {
        throw new RpcException('Category not found');
      }
      product.category = category;
    }
    product.image = param.image || product.image;
    return await this.productRepository.save(product);
  }

  async addImageToProduct(param: {
    product: number,
    images: string[]
  }): Promise<Product> {
    console.log("Adding images to product", param.product);
    const product = await this.productRepository.findOne({
      where: {
        id: param.product
      }
    });
    if (!product) {
      throw new RpcException('Product not found');
    }
    console.log("Adding images to product", param.images);
    await Promise.all(param.images.map(async (image) => {
      const img = this.productImageRepository.create({
        product: product,
        image: image
      });
      await this.productImageRepository.save(img);
    }));
    return await this.productRepository.findOne({
      where: {
        id: param.product
      },
      relations: [
        'category',
        'variants',
        'images'
      ]
    });
  }

  async removeProductById(id: number,): Promise<Product> {
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

  async calculateMinMaxPrice(param: {
    productId: number
  }): Promise<void> {
    console.log("Waiting 1s before calculating min max price for " + param.productId + "...")
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Calculating min max price for " + param.productId)
    const product = await this.productRepository.findOne({
      where: {
        id: param.productId
      },
      relations: [
        'variants'
      ]
    });
    if (!product) {
      throw new RpcException('Product not found');
    }
    if (product.variants.length <= 0) {
      return
    }
    let minPrice = product.variants[0].price, maxPrice = product.variants[0].price;
    product.variants.forEach(variant => {
      console.log(`Variant ${JSON.stringify(variant, null, 2)}`)
      if (variant.price < minPrice) {
        minPrice = variant.price;
      }
      if (variant.price > maxPrice) {
        maxPrice = variant.price;
      }
    });
    console.log(`Min price: ${minPrice}, max price: ${maxPrice}`)
    product.minPrice = minPrice;
    product.maxPrice = maxPrice;
    await this.productRepository.save(product);
  }

  async setProductVariant(param: {
    product: number,
    size: string,
    color: string,
    image?: string,
    price?: number,
    quantity?: number
  }): Promise<ProductVariant> {
    let size: Size, color: Color;
    try {
      size = ParseSize(param.size);
      color = ParseColor(param.color);
    } catch (e) {
      throw new RpcException(e.message);
    }
    const product = await this.productRepository.findOne({
      where: {
        id: param.product
      }
    });
    if (!product) {
      throw new RpcException('Product not found');
    }
    const variant = await this.productVariantRepository.findOne({
      where: {
        product: product,
        size,
        color
      }
    });
    if (variant) {
      variant.image = param.image || variant.image;
      variant.price = param.price || variant.price;
      variant.quantity = param.quantity || variant.quantity;
      await this.calculateMinMaxPrice({productId: param.product});
      return await this.productVariantRepository.save(variant);
    }
    if (!param.image) {
      throw new RpcException('Image is required for new variant');
    }
    if (!param.price) {
      throw new RpcException('Price is required for new variant');
    }
    if (!param.quantity) {
      throw new RpcException('Quantity is required for new variant');
    }
    const newVariant = this.productVariantRepository.create({
      product: product,
      size,
      color,
      image: param.image,
      price: param.price,
      quantity: param.quantity
    });
    await this.calculateMinMaxPrice({productId: param.product});
    return await this.productVariantRepository.save(newVariant);
  }

  async getProductVariantById(param: {
    id: number
  }): Promise<ProductVariant> {
    return await this.productVariantRepository.findOne({
      where: {
        product: {
          id: param.id
        }
      },
      relations: {
        product: {
          store: true,
          category: true
        }
      }
    });
  }

  async getProductVariant(param: {
    productId: number,
    size: string,
    color: string
  }): Promise<ProductVariant> {
    let size: Size, color: Color;
    try {
      size = ParseSize(param.size);
      color = ParseColor(param.color);
    } catch (e) {
      throw new RpcException(e.message);
    }
    const product = await this.productRepository.findOne({
      where: {
        id: param.productId
      }
    });
    if (!product) {
      throw new RpcException('Product not found');
    }
    const variant = await this.productVariantRepository.findOne({
      where: {
        product: product,
        size,
        color
      }
    });
    if (!variant) {
      throw new RpcException('Variant not found');
    }
    return variant;
  }

  async removeProductVariant(param: {productId: number, size: string, color: string}): Promise<ProductVariant> {
    let size: Size, color: Color;
    try {
      size = ParseSize(param.size);
      color = ParseColor(param.color);
    } catch (e) {
      throw new RpcException(e.message);
    }
    const product = await this.productRepository.findOne({
      where: {
        id: param.productId
      }
    });
    if (!product) {
      throw new RpcException('Product not found');
    }
    const variant = await this.productVariantRepository.findOne({
      where: {
        product: product,
        size,
        color
      }
    });
    if (!variant) {
      throw new RpcException('Variant not found');
    }
    this.calculateMinMaxPrice({productId: param.productId});
    return await this.productVariantRepository.remove(variant);
  }

  async getProducts(params: {
    ids: number[],
  }): Promise<Product[]> {
    return this.productRepository.find({
      where: {
        id: In(params.ids)
      },
      relations: [
        'category',
        'variants',
        'images'
      ]
    });
  }

  async getProductVariants(params: {
    ids: number[],
  }): Promise<ProductVariant[]> {
    console.log("Getting product variants: ", params.ids)
    return this.productVariantRepository.find({
      where: {
        id: In(params.ids)
      },
      relations: {
        product: {
          store: true
        }
      }
    });
  }

  async createStyle(param: {
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
  }): Promise<Style> {
    const store = await this.storeRepository.findOne({
      where: {
        id: param.store
      }
    });
    if (!param.name) {
      throw new RpcException('Name is required');
    }
    if (!store) {
      throw new RpcException('Store not found');
    }
    console.log("Create Style in store:", store.id)
    const category = parseStyleCategory(param.category);
    console.log("Style category:", category)

    console.log("Rectangles:", param.rectangles)
    const variantIds = [...new Set(param.rectangles.map(rect => rect.variant))];

    console.log("Styles Variant IDs:", variantIds)
    const variants = await this.getProductVariants({ids: variantIds});

    console.log("Style Variants:", variants)
    if (variants.length !== variantIds.length) {
      throw new RpcException('Variant not found');
    }
    const variantMap = {};
    variants.forEach(variant => {
      variantMap[variant.id] = variant;
    });
    console.log("Style Variant Map:", variantMap)

    const style: Style = this.styleRepository.create({
      name: param.name,
      category: category,
      store: store,
      mainImage: param.mainImage,
      width: param.width,
      height: param.height,
    });

    console.log("Creating Style:", JSON.stringify(style, null, 2))

    const savedStyle = await this.styleRepository.save(style);

    // const rectangles = await Promise.all(param.rectangles.map(rect => {
    //   return this.rectangleRepository.save(this.rectangleRepository.create({
    //     minX: rect.minX,
    //     minY: rect.minY,
    //     maxX: rect.maxX,
    //     maxY: rect.maxY,
    //     variant: variantMap[rect.variant],
    //     style: savedStyle
    //   }));
    // }));
    const rectangles = [];
    for (const rect of param.rectangles) {
      const rectangle = await this.rectangleRepository.save(this.rectangleRepository.create({
        minX: rect.minX,
        minY: rect.minY,
        maxX: rect.maxX,
        maxY: rect.maxY,
        variant: variantMap[rect.variant],
        style: savedStyle
      }));
      rectangles.push(rectangle);
    }

    console.log("Style Rectangles:", rectangles)

    return savedStyle;
  }

  async updateStyle(param: {
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
  }): Promise<Style> {
    const style = await this.styleRepository.findOne({
      where: {
        id: param.id
      },
      relations: {
        store: true,
        rectangles: true,
        images: true
      }
    });
    console.log("Style:", JSON.stringify(style, null, 2))
    if (!style) {
      throw new RpcException('Style not found');
    }
    if (param.name) {
      style.name = param.name;
    }
    if (param.category) {
      style.category = parseStyleCategory(param.category);
    }
    if (param.mainImage) {
      style.mainImage = param.mainImage;
    }
    if (param.width) {
      style.width = param.width;
    }
    if (param.height) {
      style.height = param.height;
    }

    console.log("Updating Style:", JSON.stringify(style, null, 2))

    const newStyle = await this.styleRepository.save(style);

    if (param.rectangles) {
      console.log("Deleting old rectangles")
      await this.rectangleRepository.delete({
        style: style
      });

      const variantIds = [...new Set(param.rectangles.map(rect => rect.variant))];

      const variants = await this.getProductVariants({ids: variantIds});
      if (variants.length !== variantIds.length) {
        throw new RpcException('Variant not found');
      }
      const variantMap = {};
      variants.forEach(variant => {
        variantMap[variant.id] = variant;
      });
      
      console.log("Creating new rectangles")
      // const rectangles = await Promise.all(param.rectangles.map(rect => {
      //   return this.rectangleRepository.save(this.rectangleRepository.create({
      //     minX: rect.minX,
      //     minY: rect.minY,
      //     maxX: rect.maxX,
      //     maxY: rect.maxY,
      //     variant: variantMap[rect.variant],
      //     style: newStyle
      //   }));
      // }));
      const rectangles = [];
      for (const rect of param.rectangles) {
        const rectangle = await this.rectangleRepository.save(this.rectangleRepository.create({
          minX: rect.minX,
          minY: rect.minY,
          maxX: rect.maxX,
          maxY: rect.maxY,
          variant: variantMap[rect.variant],
          style: newStyle
        }));
        rectangles.push(rectangle);
      }
      newStyle.rectangles = rectangles.map(rect => { return {...rect, style: undefined}});
    }

    return newStyle;
  }

  async addImageToStyle(param: {
    style: number,
    image: string
  }): Promise<Style> {
    const style = await this.styleRepository.findOne({
      where: {
        id: param.style
      }
    });
    if (!style) {
      throw new RpcException('Style not found');
    }
    const img = this.styleImageRepository.create({
      style: style,
      image: param.image
    });
    await this.styleImageRepository.save(img);
    return await this.styleRepository.findOne({
      where: {
        id: param.style
      },
      relations: {
        store: true,
        rectangles: {
          variant: true
        },
        images: true
      }
    });
  }

  async removeImageFromStyle(param: {
    style: number,
    image: string
  }): Promise<Style> {
    const style = await this.styleRepository.findOne({
      where: {
        id: param.style
      }
    });
    if (!style) {
      throw new RpcException('Style not found');
    }
    const img = await this.styleImageRepository.findOne({
      where: {
        style: style,
        image: param.image
      }
    });
    if (!img) {
      throw new RpcException('Image not found');
    }
    await this.styleImageRepository.remove(img);
    return await this.styleRepository.findOne({
      where: {
        id: param.style
      },
      relations: {
        store: true,
        rectangles: {
          variant: true
        },
        images: true
      }
    });
  }

  async getStyleById(param: {id: number}): Promise<Style> {
    return await this.styleRepository.findOne({
      where: {
        id: param.id
      },
      relations: {
        store: true,
        rectangles: {
          variant: {
            product: true
          }
        },
        images: true
      }
    });
  }

  async removeStyleById(param: {id: number}): Promise<Style> {
    const style = await this.styleRepository.findOne({
      where: {
        id: param.id
      }
    });
    if (!style) {
      throw new RpcException('Style not found');
    }
    return await this.styleRepository.remove(style);
  }

  async getStylesByStore(param: {storeId: number}): Promise<Style[]> {
    return await this.styleRepository.find({
      where: {
        store: {
          id: param.storeId
        }
      },
      relations: {
        store: true,
        rectangles: {
          variant: {
            product: true
          }
        },
        images: true
      }
    });
  }

  async getStylesByCategory(param: {category: string}): Promise<Style[]> {
    return await this.styleRepository.find({
      where: {
        category: parseStyleCategory(param.category)
      },
      relations: {
        store: true,
        rectangles: {
          variant: {
            product: true
          }
        },
        images: true
      }
    });
  }

}
