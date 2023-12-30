import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ProductMSName } from 'src/config/microservices.module';
import { FileServerService } from 'src/file-server/file-server.service';
import { ProductDto } from './dto/product.dto';
import { StoreDto } from './dto/store.dto';
import { CategoriesDto } from './dto/category.dto';
import { OrderService } from 'src/order/order.service';
import { UsersService } from 'src/users/users.service';

type File = Express.Multer.File

@Injectable()
export class ProductService {
    constructor(
        @Inject(ProductMSName)
        private readonly productClient: ClientProxy,
        private readonly fileServerService: FileServerService,
        private readonly orderService: OrderService,
        private readonly userService: UsersService
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
            throw new BadRequestException('ProductMS: ' + error.message);
        }
    }
    async createCategory(param: {
        name: string,
        description?: string,
        parent?: number,
    }, image: File): Promise<CategoriesDto> {
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

    async getAllCategories(): Promise<CategoriesDto> {
        return this.send({
            cmd: 'GetAllCategories',
            data: {}
        })
    }

    async getCategoryById(id: number): Promise<CategoriesDto> {
        return this.send({
            cmd: 'GetCategoryById',
            data: { id }
        })
    }

    async editCategory(param: {
        id: number,
        name?: string,
        description?: string,
        parent?: number,
        image?: Express.Multer.File
    }): Promise<CategoriesDto> {
        const [ image ] = await Promise.all([
            param.image ? this.fileServerService.uploadImage(param.image) : null
        ])
        return this.send({
            cmd: 'EditCategory',
            data: {
                id: param.id,
                name: param.name,
                description: param.description,
                parent: param.parent,
                image
            }
        })
    }

    async registerStore(param: {
        id: number,
        name: string,
        description?: string,
        address?: number,
        logo?: Express.Multer.File,
        cover?: Express.Multer.File
    }): Promise<StoreDto> {
        console.log("Registering store:/n" + JSON.stringify(param, null, 2))
        const [ logo, cover ] = await Promise.all([
            param.logo ? this.fileServerService.uploadImage(param.logo) : Promise.resolve(null),
            param.cover ? this.fileServerService.uploadImage(param.cover) : Promise.resolve(null)
        ])
        const store = this.send({
            cmd: 'RegisterStore',
            data: {
                id: param.id,
                name: param.name,
                description: param.description,
                address: param.address,
                logo,
                cover
            }
        })
        await this.userService.changeRole({
            id: param.id,
            role: 'shop_owner'
        })
        return store
    }

    async getStoreById(id: number): Promise<StoreDto> {
        return this.send({
            cmd: 'GetStoreById',
            data: { id }
        })
    }

    async getAllUnapprovedStores(): Promise<StoreDto[]> {
        console.log('getting all unapproved stores')
        return this.send({
            cmd: 'GetAllUnapprovedStores',
            data: {}
        })
    }

    async getAllApprovedStores(): Promise<StoreDto[]> {
        return this.send({
            cmd: 'GetAllApprovedStores',
            data: {}
        })
    }

    async approveStore(id: number): Promise<StoreDto> {
        return this.send({
            cmd: 'ApproveStore',
            data: { id }
        })
    }

    async storeHas(param: {
        storeId: number,
        productId: number
    }): Promise<boolean> {
        return this.send({
            cmd: 'StoreHas',
            data: param
        })
    }

    async createProduct(param: {
        name: string,
        description?: string,
        store: number,
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
                store: param.store,
                category: param.category,
                image: imageId
            }
        })
    }

    async getProductById(id: number): Promise<any> {
        const product = await this.send({
            cmd: 'GetProductById',
            data: { id }
        })
        const variantIds = product.variants.map(variant => variant.id)
        const ratings = await this.orderService.getRatingByProductVariants({ product_variants: variantIds })
        product.ratings = ratings
        return product
    }

    async editProduct(param: {
        id: number,
        name?: string,
        description?: string,
        category?: number,
        image?: Express.Multer.File
    }): Promise<ProductDto> {
        const [ image ] = await Promise.all([
            param.image ? this.fileServerService.uploadImage(param.image) : null
        ])
        return this.send({
            cmd: 'EditProduct',
            data: {
                id: param.id,
                name: param.name,
                description: param.description,
                category: param.category,
                image
            }
        })
    }

    async addImageToProduct(param: {
        product: number,
        images: Express.Multer.File[]
    }): Promise<ProductDto> {
        const images = await Promise.all(param.images.map(image => this.fileServerService.uploadImage(image)))
        return this.send({
            cmd: 'AddImageToProduct',
            data: {
                product: param.product,
                images
            }
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

    async getProductVariantById(id: number): Promise<any> {
        return this.send({
            cmd: 'GetProductVariantById',
            data: { id }
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

    async getProducts(param: {
        ids: number[]
    }): Promise<any> {
        return this.send({
            cmd: 'GetProducts',
            data: {
                ids: param.ids
            }
        })
    }

    async getProductVariants(param: {
        ids: number[]
    }): Promise<any> {
        return this.send({
            cmd: 'GetProductVariants',
            data: {
                ids: param.ids
            }
        })
    }

    // async replaceItemsWithVariants(param: {

    // })

    async getCartWithItems(param: {
        id: number
    }): Promise<any> {
        const cart = await this.orderService.getCart(param)

        const variants = await this.getProductVariants({ ids: cart.items.map(item => item.product_variant) })

        const productStoreMap = {
            ids:[],
            entities:{}
        }
        variants.forEach(variant => {
            if (
                !productStoreMap.ids.includes(variant.product.store.id)
            ) {
                productStoreMap.ids.push(variant.product.store.id)
                productStoreMap.entities[variant.product.store.id] = {
                    ...variant.product.store,
                    items: {
                        ids: [],
                        entities: {}
                    }
                }
            }
        })

        const itemsWithVariant = await this.addVariantToItems(cart.items)

        itemsWithVariant.ids.forEach(id => {
            const item = itemsWithVariant.entities[id]
            const storeId = item.product.store.id
            productStoreMap.entities[storeId].items.ids.push(id)
            productStoreMap.entities[storeId].items.entities[id] = item
            
        })

        cart.items = undefined

        cart.stores = productStoreMap

        return cart
    }

    async createOrder(param: {
        user_id: number,
        contact_id: number,
        items: number[],
    }): Promise<any> {

        const variants = await this.getProductVariants({ ids: param.items })

        const stores = []
        variants.forEach(variant => {
            if (!stores.includes(variant.product.store.id)) {
                stores.push(variant.product.store.id)
            }
        })

        if (stores.length > 1) {
            throw new BadRequestException('Cannot order from multiple stores')
        }

        const store_id = stores[0]

        return this.orderService.createOrder({
            user_id: param.user_id,
            contact_id: param.contact_id,
            store_id: store_id,
            items: param.items,
        })
    }

    async addVariantToItems(param: [
        {
            "id": number,
            "product_variant": number,
            "quantity": number
        }
    ]) {
        const variants = await this.getProductVariants({ ids: param.map(item => item.product_variant) });

        const variantsMap = {};
        variants.forEach(variant => {
            variantsMap[variant.id] = variant;
        });

        const ids = [];
        const entities = {};
        param.forEach(item => {
            const variant = variantsMap[item.product_variant];
            const entity = {
                ...variant,
                item_id: item.id,
                quantity: item.quantity
            };
            entities[entity.item_id] = entity;
            ids.push(item.id);
        });
        return {
            ids: ids,
            entities: entities,
        };
    }

    async getOrdersByUser(param: {
        user_id: number
    }): Promise<any> {
        let orders = await this.orderService.getOrdersByUser(param)
        orders = await Promise.all(orders.map(async order => {
            order.items = await this.addVariantToItems(order.items);
            return order;
        }));
        return orders
    }

    async getOrdersByStore(param: {
        store_id: number
    }): Promise<any> {
        let orders = await this.orderService.getOrdersByStore(param)
        orders = await Promise.all(orders.map(async order => {
            order.items = await this.addVariantToItems(order.items);
            return order;
        }));
        return orders
    }
}
