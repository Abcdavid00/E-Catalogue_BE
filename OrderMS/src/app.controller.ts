import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import { DeliverStatus } from './entities/deliver-status.enum';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @MessagePattern({ cmd: 'Hi' })
  ping(): string {
    return this.appService.getHello();
  }

  @MessagePattern({ cmd: 'CreateItem' })
  createItem(param: {
    product_variant: number,
    quantity: number,
  }) {
    return this.appService.createItem(param);
  }

  @MessagePattern({ cmd: 'UpdateItem' })
  updateItem(param: {
    id: number,
    quantity: number,
  }) {
    return this.appService.updateItem(param);
  }

  @MessagePattern({ cmd: 'GetItem' })
  getItem(param: {
    id: number,
  }) {
    return this.appService.getItem(param);
  }

  @MessagePattern({ cmd: 'DeleteItem' })
  deleteItem(param: {
    id: number,
  }) {
    return this.appService.deleteItem(param);
  }

  @MessagePattern({ cmd: 'GetCart' })
  getCart(param: {
    id: number,
  }) {
    return this.appService.getCart(param);
  }

  @MessagePattern({ cmd: 'AddItemToCart' })
  addItemToCart(param: {
    cart_id: number,
    item_id: number,
  }) {
    return this.appService.addItemToCart(param);
  }

  @MessagePattern({ cmd: 'RemoveItemFromCart' })
  removeItemFromCart(param: {
    cart_id: number,
    item_id: number,
  }) {
    return this.appService.removeItemFromCart(param);
  }

  @MessagePattern({ cmd: 'CreateOrder' })
  createOrder(param: {
    user_id: number,
    contact_id: number,
    store_id: number,
    items: number[],
    total_price: number,
  }) {
    param.total_price = param.total_price || 0;
    return this.appService.createOrder(param);
  }

  @MessagePattern({ cmd: 'GetOrder' })
  getOrder(param: {
    id: number,
  }) {
    return this.appService.getOrder(param);
  }

  @MessagePattern({ cmd: 'GetOrdersByUser' })
  getOrdersByUser(param: {
    user_id: number,
  }) {
    return this.appService.getOrdersByUser(param);
  }

  @MessagePattern({ cmd: 'GetOrdersByStore' })
  getOrdersByStore(param: {
    store_id: number,
  }) {
    return this.appService.getOrdersByStore(param);
  }

  @MessagePattern({ cmd: 'UpdateOrderStatus' })
  updateOrderStatus(param: {
    id: number,
    status: string,
  }) {
    return this.appService.updateOrderStatus(param);
  }

  @MessagePattern({ cmd: 'SetRating' })
  setRating(param: {
    order_id: number,
    product_variant: number,
    rate?: number,
    comment?: string,
  }) {
    return this.appService.setRating(param);
  }

  @MessagePattern({ cmd: 'GetRating' })
  getRating(param: {
    id: number,
  }) {
    return this.appService.getRating(param);
  }

  @MessagePattern({ cmd: 'GetRatingByProductVariant' })
  getRatingByProductVariant(param: {
    product_variant: number,
  }) {
    return this.appService.getRatingByProductVariant(param);
  }

  @MessagePattern({ cmd: 'GetRatingByProductVariants' })
  getRatingByProductVariants(param: {
    product_variants: number[],
  }) {
    return this.appService.getRatingByProductVariants(param);
  }
}
