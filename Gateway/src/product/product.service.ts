import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ProductMSName } from 'src/config/microservices.module';
import { FileServerService } from 'src/file-server/file-server.service';
import { ProductDto } from './dto/product.dto';
import { CategoriesDto } from './dto/category.dto';
import { OrderService } from 'src/order/order.service';
import { UsersService } from 'src/users/users.service';
import { UserInfoMsService } from 'src/user-info-ms/user-info-ms.service';

type File = Express.Multer.File

@Injectable()
export class ProductService {
    constructor(
        @Inject(ProductMSName)
        private readonly productClient: ClientProxy,
        private readonly fileServerService: FileServerService,
        private readonly orderService: OrderService,
        private readonly userService: UsersService,
        private readonly userInfoService: UserInfoMsService
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
    }): Promise<any> {
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

    async addFollowerForStore(store) {
        const follows = await this.userInfoService.getStoreFollowByStore({ storeId: store.id })
        store.followers = follows.map(follow => follow.userId)
        return store
    }

    async getStoreById(id: number): Promise<any> {
        const store = await this.send({
            cmd: 'GetStoreById',
            data: { id }
        })
        const productIds = store.products.map(product => product.id)
        const products = await Promise.all(productIds.map(id => this.getProductById(id)))
        let ratingCount = 0
        products.forEach(product => {
            ratingCount += product.ratings.length
        })
        store.ratingCount = ratingCount
        return this.addFollowerForStore(store)
    }

    async getAllUnapprovedStores(): Promise<any> {
        console.log('getting all unapproved stores')
        return this.send({
            cmd: 'GetAllUnapprovedStores',
            data: {}
        })
    }

    async getAllApprovedStores(): Promise<any> {
        const stores = await this.send({
            cmd: 'GetAllApprovedStores',
            data: {}
        })
        return Promise.all(stores.map(store => this.addFollowerForStore(store)))
    }

    async approveStore(id: number): Promise<any> {
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

        const items = await this.orderService.getItems({ ids: param.items })
        if (items.length === 0) {
            throw new BadRequestException('No items in cart')
        }
        const variants = await this.getProductVariants({ ids: items.map(item => item.product_variant) })

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

    async createStyle(param: {
        name: string,
        category: string,
        store: number,
        mainImage: Express.Multer.File,
        width: number,
        height: number,
        rectangles: {
            minX: number,
            minY: number,
            maxX: number,
            maxY: number,
            variant: number
        }[],
    }): Promise<any> {
        const mainImage = await this.fileServerService.uploadImage(param.mainImage);
        return this.send({
            cmd: 'CreateStyle',
            data: {
                name: param.name,
                category: param.category,
                store: param.store,
                mainImage,
                width: param.width,
                height: param.height,
                rectangles: param.rectangles
            }
        })
    }

    async updateStyle(param: {
        id: number,
        name?: string,
        category?: string,
        mainImage?: Express.Multer.File,
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
        let mainImage = undefined;
        if (param.mainImage) {
            mainImage = await this.fileServerService.uploadImage(param.mainImage);
        }
        return this.send({
            cmd: 'UpdateStyle',
            data: {
                id: param.id,
                name: param.name,
                category: param.category,
                mainImage: mainImage,
                width: param.width,
                height: param.height,
                rectangles: param.rectangles
            }
        })
    }

    async addImageToStyle(param: {
        style: number,
        image: Express.Multer.File
    }): Promise<any> {
        const image = await this.fileServerService.uploadImage(param.image);
        return this.send({
            cmd: 'AddImageToStyle',
            data: {
                style: param.style,
                image: image
            }
        })
    }

    async removeImageFromStyle(param: {
        style: number,
        image: string
    }): Promise<any> {
        return this.send({
            cmd: 'RemoveImageFromStyle',
            data: param
        })
    }

    async getStyleById(param: {id: number}): Promise<any> {
        return this.send({
            cmd: 'GetStyleById',
            data: param
        })
    }

    async removeStyleById(param: {id: number}): Promise<any> {
        return this.send({
            cmd: 'RemoveStyleById',
            data: param
        })
    }

    async getStylesByStore(param: {storeId: number}): Promise<any> {
        return this.send({
            cmd: 'GetStylesByStore',
            data: param
        })
    }

    async getStylesByCategory(param: {category: string}): Promise<any> {
        return this.send({
            cmd: 'GetStylesByCategory',
            data: param
        })
    }
}
