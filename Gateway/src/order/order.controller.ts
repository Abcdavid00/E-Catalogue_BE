import { Body, Controller, Delete, Get, Post, Put, Query, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { OrderService } from './order.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('order')
export class OrderController {
    constructor(
        private readonly orderService: OrderService,
    ) {}

    @Post('item')
    @ApiOperation({ summary: 'Create item' })
    @ApiTags('Item')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                product_variant: {
                    type: 'number',
                    example: 1,
                },
                quantity: {
                    type: 'number',
                    example: 1,
                },
            }
        }
    })
    async createItem(@Body() param: {
        product_variant: number,
        quantity: number,
    }): Promise<any> {
        return this.orderService.createItem(param);
    }

    @Put('item')
    @ApiOperation({ summary: 'Update item' })
    @ApiTags('Item')
    @ApiQuery({
        name: 'id',
        type: 'number',
        example: 1,
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                quantity: {
                    type: 'number',
                    example: 1,
                },
            }
        }
    })
    async updateItem(@Query('id') id, @Body() param: {
        quantity: number,
    }): Promise<any> {
        return this.orderService.updateItem({
            id: id,
            quantity: param.quantity,
        });
    }

    @Get('item')
    @ApiOperation({ summary: 'Get item' })
    @ApiTags('Item')
    @ApiQuery({
        name: 'id',
        type: 'number',
        example: 1,
    })
    async getItem(@Query('id') id): Promise<any> {
        return this.orderService.getItem({
            id: id,
        });
    }

    @Delete('item')
    @ApiOperation({ summary: 'Delete item' })
    @ApiTags('Item')
    @ApiQuery({
        name: 'id',
        type: 'number',
        example: 1,
    })
    async deleteItem(@Query('id') id): Promise<any> {
        return this.orderService.deleteItem({
            id: id,
        });
    }

    // @Get('cart')
    // @ApiOperation({ summary: 'Get cart' })
    // @ApiTags('Cart')
    // @ApiBearerAuth()
    // @UseGuards(JwtAuthGuard)
    // async getCart(@Request() req): Promise<any> {
    //     const id = req.user.id;
    //     return this.orderService.getCart({
    //         id: id,
    //     });
    // }

    @Post('cart')
    @ApiOperation({ summary: 'Add item to cart' })
    @ApiTags('Cart', 'Item')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                product_variant: {
                    type: 'number',
                    example: 1,
                },
                quantity: {
                    type: 'number',
                    example: 1,
                },
            }
        }
    })
    async addItemToCart(@Request() req, @Body() param: {
        product_variant: number,
        quantity: number,
    }): Promise<any> {
        const id = req.user.id;
        return this.orderService.createAndAddItemToCart({
            cart_id: id,
            product_variant: param.product_variant,
            quantity: param.quantity,
        });
    }

    @Delete('cart')
    @ApiOperation({ summary: 'Remove item from cart' })
    @ApiTags('Cart', 'Item')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                item_id: {
                    type: 'number',
                    example: 1,
                },
            }
        }
    })
    async removeItemFromCart(@Request() req, @Body() param: {
        item_id: number,
    }): Promise<any> {
        const id = req.user.id;
        return this.orderService.removeItemFromCart({
            cart_id: id,
            item_id: param.item_id,
        });
    }

    @Put('cancel')
    @ApiOperation({ summary: 'Cancel order' })
    @ApiTags('Order')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiQuery({
        name: 'id',
        type: 'number',
        example: 1,
    })
    async cancelOrder(@Request() req, @Query('id') id): Promise<any> {
        const user_id = req.user.id;
        const order = await this.orderService.getOrder({
            id: id,
        });
        if (order.user_id !== user_id && order.store_id !== user_id) {
            throw new UnauthorizedException('You are not allowed to access this order');
        }
        return this.orderService.updateOrderStatus({
            id: id,
            status: 'cancelled',
        })
    }


    // @Post()
    // @ApiOperation({ summary: 'Create order' })
    // @ApiTags('Order')
    // @ApiBearerAuth()
    // @UseGuards(JwtAuthGuard)
    // @ApiBody({
    //     schema: {
    //         type: 'object',
    //         properties: {
    //             contact_id: {
    //                 type: 'number',
    //                 example: 1,
    //             },
    //             items: {
    //                 type: 'array',
    //                 items: {
    //                     type: 'number',
    //                     example: 1,
    //                 },
    //             },
    //         }
    //     }
    // })
    // async createOrder(@Request() req, @Body() param: {
    //     contact_id: number,
    //     items: number[],
    // }): Promise<any> {
    //     const id = req.user.id;
    //     return this.orderService.createOrder({
    //         user_id: id,
    //         contact_id: param.contact_id,
    //         items: param.items,
    //     });
    // }

    // @Get()
    // @ApiOperation({ summary: 'Get order' })
    // @ApiTags('Order')
    // @ApiBearerAuth()
    // @UseGuards(JwtAuthGuard)
    // @ApiQuery({
    //     name: 'id',
    //     type: 'number',
    //     example: 1,
    // })
    // async getOrder(@Request() req, @Query('id') id): Promise<any> {
    //     const user_id = req.user.id;
    //     const order = await this.orderService.getOrder({
    //         id: id,
    //     });
    //     if (order.user_id !== user_id) {
    //         throw new UnauthorizedException('You are not allowed to access this order');
    //     }
    //     return order;
    // }

    // @Get('all')
    // @ApiOperation({ summary: 'Get orders by user' })
    // @ApiTags('Order')
    // @ApiBearerAuth()
    // @UseGuards(JwtAuthGuard)
    // async getOrdersByUser(@Request() req): Promise<any> {
    //     const id = req.user.id;
    //     return this.orderService.getOrdersByUser({
    //         user_id: id,
    //     });
    // }

    // @Get('store')
    // @ApiOperation({ summary: 'Get orders by store' })
    // @ApiTags('Order')
    // @ApiBearerAuth()
    // @UseGuards(JwtAuthGuard)
    // async getOrdersByStore(@Request() req): Promise<any> {
    //     const id = req.user.id;
    //     if (req.user.role !== 'shop_owner') {
    //         throw new UnauthorizedException('You are not a store owner');
    //     }
    //     return this.orderService.getOrdersByStore({
    //         store_id: id,
    //     });
    // }

    @Put()
    @ApiOperation({ summary: 'Update order status' })
    @ApiTags('Order')
    // @ApiBearerAuth()
    // @UseGuards(JwtAuthGuard)
    @ApiQuery({
        name: 'id',
        type: 'number',
        example: 1,
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                status: {
                    type: 'string',
                    example: 'pending',
                },
            }
        }
    })
    async updateOrderStatus(@Query('id') id, @Body() param: {
        status: string,
    }): Promise<any> {
        return this.orderService.updateOrderStatus({
            id: id,
            status: param.status,
        });
    }

    @Post('rating')
    @ApiOperation({ summary: 'Set rating' })
    @ApiTags('Rating')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                order_id: {
                    type: 'number',
                    example: 1,
                },
                product_variant: {
                    type: 'number',
                    example: 1,
                },
                rate: {
                    type: 'number',
                    example: 5,
                },
                comment: {
                    type: 'string',
                    example: 'Very good',
                },
            }
        }
    })
    async setRating(@Request() req, @Body() param: {
        order_id: number,
        product_variant: number,
        rate?: number,
        comment?: string,
    }): Promise<any> {
        const id = req.user.id;
        const order = await this.orderService.getOrder({
            id: param.order_id,
        });
        if (!order) {
            throw new UnauthorizedException('Order not found');
        }
        if (order.user_id !== id) {
            throw new UnauthorizedException('You are not allowed to rate this product');
        }
        return this.orderService.setRating(param);
    }
    
    @Get('rating')
    @ApiOperation({ summary: 'Get rating' })
    @ApiTags('Rating')
    @ApiQuery({
        name: 'id',
        type: 'number',
        example: 1,
    })
    async getRating(@Query('id') id): Promise<any> {
        return this.orderService.getRating({
            id: id,
        });
    }
}
