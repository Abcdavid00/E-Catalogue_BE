import { Inject, Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { Cart } from './entities/cart.entity';
import { Rating } from './entities/rating.entity';
import { RpcException } from '@nestjs/microservices';
import { parseDeliverStatus } from './entities/deliver-status.enum';

@Injectable()
export class AppService {

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>,
  ) {}

  getHello(): string {
    return 'OrderMS online!';
  }

  async createItem(param: {
    product_variant: number,
    quantity: number,
  }) {
    if (!param.product_variant) {
      throw new RpcException('Product variant is required');
    }
    if (param.quantity <= 0) {
      throw new RpcException('Quantity must be greater than 0');
    }
    const item = this.itemRepository.create({
      product_variant: param.product_variant,
      quantity: param.quantity ? param.quantity : 1,
    });
    return this.itemRepository.save(item);
  }

  async updateItem(param: {
    id: number,
    quantity: number,
  }) {
    if (!param.id) {
      throw new RpcException('Item ID is required');
    }
    if (!param.quantity) {
      throw new RpcException('Quantity is required');
    }
    if (param.quantity <= 0) {
      throw new RpcException('Quantity must be greater than 0');
    }
    const item = await this.itemRepository.findOne({
      where: {
        id: param.id,
      },
    });
    if (!item) {
      throw new RpcException('Item not found');
    }
    item.quantity = param.quantity;
    return this.itemRepository.save(item);
  }

  async getItem(param: {
    id: number,
  }) {
    if (!param.id) {
      throw new RpcException('Item ID is required');
    }
    return this.itemRepository.findOne({
      where: {
        id: param.id,
      },
    });
  }

  async deleteItem(param: {
    id: number,
  }) {
    if (!param.id) {
      throw new RpcException('Item ID is required');
    }
    const item = await this.itemRepository.findOne({
      where: {
        id: param.id,
      },
    });
    if (!item) {
      throw new RpcException('Item not found');
    }
    return this.itemRepository.remove(item);
  }

  createCart(param: {
    id: number,
  }) {
    if (!param.id) {
      throw new RpcException('Cart ID is required');
    }
    const cart = this.cartRepository.create({
      id: param.id,
    });
    return this.cartRepository.save(cart);
  }

  async getCart(param: {
    id: number,
  }) {
    if (!param.id) {
      throw new RpcException('Cart ID is required');
    }

    const cart = await this.cartRepository.findOne({
      where: {
        id: param.id,
      },
      relations: ['items'],
    });

    if (cart) {
      return cart;
    }
    return this.createCart(param);
  }

  async addItemToCart(param: {
    cart_id: number,
    item_id: number,
  }) {
    if (!param.cart_id) {
      throw new RpcException('Cart ID is required');
    }
    if (!param.item_id) {
      throw new RpcException('Item ID is required');
    }
    const cart = await this.getCart({
      id: param.cart_id,
    })
    const item = await this.itemRepository.findOne({
      where: {
        id: param.item_id,
      },
    });
    if (!item) {
      throw new RpcException('Item not found');
    }
    const existing_pv = cart.items.find(i => i.product_variant === item.product_variant);
    if (existing_pv) {
      existing_pv.quantity += item.quantity;
      await this.itemRepository.save(existing_pv);
      return cart;
    }
    cart.items.push(item);
    return this.cartRepository.save(cart);
  }

  async removeItemFromCart(param: {
    cart_id: number,
    item_id: number,
  }) {
    if (!param.cart_id) {
      throw new RpcException('Cart ID is required');
    }
    if (!param.item_id) {
      throw new RpcException('Item ID is required');
    }
    const cart = await this.getCart({
      id: param.cart_id,
    })
    const item = await this.itemRepository.findOne({
      where: {
        id: param.item_id,
      },
    });
    if (!item) {
      throw new RpcException('Item not found');
    }
    cart.items = cart.items.filter(i => i.id !== item.id);

    return this.cartRepository.save(cart);
  }

  async createOrder(param: {
    user_id: number,
    contact_id: number,
    store_id: number,
    items: number[],
    total_price: number,
  }) {
    if (!param.user_id) {
      throw new RpcException('User ID is required');
    }
    if (!param.contact_id) {
      throw new RpcException('Contact ID is required');
    }
    if (!param.items) {
      throw new RpcException('Items is required');
    }
    if (param.items.length === 0) {
      throw new RpcException('Items is required');
    }
    const items = await this.itemRepository.findByIds(param.items);
    if (items.length === 0) {
      throw new RpcException('Items not found');
    }
    console.log('Create order param', param)
    const order = this.orderRepository.create({
      user_id: param.user_id,
      contact_id: param.contact_id,
      store_id: param.store_id,
      items: items,
      total_price: param.total_price,
    });
    return this.orderRepository.save(order);
  }

  async getOrder(param: {
    id: number,
  }) {
    if (!param.id) {
      throw new RpcException('Order ID is required');
    }
    return this.orderRepository.findOne({
      where: {
        id: param.id,
      },
      relations: ['items'],
    });
  }

  async getOrdersByUser(param: {
    user_id: number,
  }) {
    if (!param.user_id) {
      throw new RpcException('User ID is required');
    }
    return this.orderRepository.find({
      where: {
        user_id: param.user_id,
      },
      relations: ['items'],
    });
  }

  async getOrdersByStore(param: {
    store_id: number,
  }) {
    if (!param.store_id) {
      throw new RpcException('Store ID is required');
    }
    return this.orderRepository.find({
      where: {
        store_id: param.store_id,
      },
      relations: ['items'],
    });
  }

  async updateOrderStatus(param: {
    id: number,
    status: string,
  }) {
    if (!param.id) {
      throw new RpcException('Order ID is required');
    }
    if (!param.status) {
      throw new RpcException('Status is required');
    }
    const order = await this.orderRepository.findOne({
      where: {
        id: param.id,
      },
      relations: ['items'],
    });
    if (!order) {
      throw new RpcException('Order not found');
    }
    if (order.deliver_status === 'delivered') {
      throw new RpcException('Order has been delivered');
    }
    if (order.deliver_status === 'canceled') {
      throw new RpcException('Order has been canceled');
    }

    order.deliver_status = parseDeliverStatus(param.status);
    return this.orderRepository.save(order);
  }

  async setRating(param: {
    order_id: number,
    product_variant: number,
    rate?: number,
    comment?: string,
  }) {
    if (!param.order_id) {
      throw new RpcException('Order ID is required');
    }
    if (!param.product_variant) {
      throw new RpcException('Product variant is required');
    }
    if (param.rate) {
      if (param.rate < 1 || param.rate > 5) {
        throw new RpcException('Rate must be between 1 and 5');
      }
    }

    const order = await this.orderRepository.findOne({
      where: {
        id: param.order_id,
      },
      relations: ['items'],
    });

    if (!order) {
      throw new RpcException('Order not found');
    }
    if (order.deliver_status !== 'delivered') {
      throw new RpcException('Order has not been delivered');
    }

    const item = order.items.find(i => i.product_variant === param.product_variant);
    if (!item) {
      throw new RpcException('Item not found');
    }



    const rating = await this.ratingRepository.findOne({
      where: {
        order: order,
        product_variant: param.product_variant,
      },
    });

    if (rating) {
      if (param.rate) {
        rating.rate = param.rate;
      }
      if (param.comment) {
        rating.comment = param.comment;
        return this.ratingRepository.save(rating);
      }
    }

    if (!param.rate) {
      throw new RpcException('Rate point is required for new rating');
    }

    const newRating = this.ratingRepository.create({
      order: order,
      product_variant: param.product_variant,
      rate: param.rate,
      comment: param.comment,
    });

    return this.ratingRepository.save(newRating);
  }

  getRating(param: {
    id: number,
  }) {
    if (!param.id) {
      throw new RpcException('Order ID is required');
    }
    return this.ratingRepository.findOne({
      where: {
        id: param.id,
      },
    });
  }

  async getRatingByOrder(param: {
    order_id: number,
  }) {
    if (!param.order_id) {
      throw new RpcException('Order ID is required');
    }
    const order = await this.orderRepository.findOne({
      where: {
        id: param.order_id,
      },
    })
    if (!order) {
      throw new RpcException('Order not found');
    }
    return this.ratingRepository.find({
      where: {
        order: order,
      },
    });
  }

  getRatingByProductVariant(param: {
    product_variant: number,
  }) {
    if (!param.product_variant) {
      throw new RpcException('Product variant is required');
    }
    return this.ratingRepository.find({
      where: {
        product_variant: param.product_variant,
      },
      relations: ['order'],
    });
  }

  getRatingByProductVariants(param: {
    product_variants: number[],
  }) {
    if (!param.product_variants) {
      throw new RpcException('Product variant is required');
    }
    return this.ratingRepository.find({
      where: {
        product_variant: In(param.product_variants)
      },
      relations: ['order'],
    });
  }

  getItems(param: {
    ids: number[],
  }) {
    if (!param.ids) {
      throw new RpcException('Item IDs is required');
    }
    return this.itemRepository.find({
      where: {
        id: In(param.ids),
      },
    })
  }
  
}
