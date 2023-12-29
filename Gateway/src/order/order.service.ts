import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { OrderMSName } from 'src/config/microservices.module';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class OrderService {
    constructor(
        @Inject(OrderMSName)
        private readonly orderMSClient: ClientProxy
    ) {}

    async send(param: {
        cmd: string,
        data: any
    }): Promise<any> {
        try {
            const res = await this.orderMSClient.send<any>({ cmd: param.cmd }, param.data).toPromise();
            return res;
        } catch (error) {
            throw new BadRequestException('OrderMS: ' + error.message);
        }
    }

    async createItem(param: {
        product_variant: number,
        quantity: number,
    }): Promise<any> {
        return this.send({
            cmd: 'CreateItem',
            data: param
        })
    }

    async updateItem(param: {
        id: number,
        quantity: number,
    }): Promise<any> {
        return this.send({
            cmd: 'UpdateItem',
            data: param
        })
    }

    async getItem(param: {id: number}): Promise<any> {
        return this.send({
            cmd: 'GetItem',
            data: param
        })
    }

    async deleteItem(param: {id: number}): Promise<any> {
        return this.send({
            cmd: 'DeleteItem',
            data: param
        })
    }

    async getCart(param: {id: number}): Promise<any> {
        return this.send({
            cmd: 'GetCart',
            data: param
        })
    }

    async addItemToCart(param: {
        cart_id: number,
        item_id: number,
    }): Promise<any> {
        return this.send({
            cmd: 'AddItemToCart',
            data: param
        })
    }

    async createAndAddItemToCart(param: {
        cart_id: number,
        product_variant: number,
        quantity: number,
    }): Promise<any> {
        const item = await this.createItem({
            product_variant: param.product_variant,
            quantity: param.quantity,
        });
        return this.addItemToCart({
            cart_id: param.cart_id,
            item_id: item.id,
        });
    }

    async removeItemFromCart(param: {
        cart_id: number,
        item_id: number,
    }): Promise<any> {
        return this.send({
            cmd: 'RemoveItemFromCart',
            data: param
        })
    }

    createOrder(param: {
        user_id: number,
        contact_id: number,
        store_id: number,
        items: number[],
    }): Promise<any> {
        return this.send({
            cmd: 'CreateOrder',
            data: param
        })
    }

    getOrder(param: {
        id: number,
    }): Promise<any> {
        return this.send({
            cmd: 'GetOrder',
            data: param
        })
    }

    getOrdersByUser(param: {
        user_id: number,
    }): Promise<any> {
        return this.send({
            cmd: 'GetOrdersByUser',
            data: param
        })
    }

    updateOrderStatus(param: {
        id: number,
        status: string,
    }): Promise<any> {
        return this.send({
            cmd: 'UpdateOrderStatus',
            data: param
        })
    }

    setRating(param: {
        order_id: number,
        product_variant: number,
        rate?: number,
        comment?: string,
    }): Promise<any> {
        return this.send({
            cmd: 'SetRating',
            data: param
        })
    }

    getRating(param: {
        id: number,
    }): Promise<any> {
        return this.send({
            cmd: 'GetRating',
            data: param
        })
    }

    getRatingByProductVariant(param: {
        product_variant: number,
    }): Promise<any> {
        return this.send({
            cmd: 'GetRatingByProductVariant',
            data: param
        })
    }

    getRatingByProductVariants(param: {
        product_variants: number[],
    }): Promise<any> {
        return this.send({
            cmd: 'GetRatingByProductVariants',
            data: param
        })
    }
}
