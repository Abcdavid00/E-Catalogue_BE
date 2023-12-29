import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ApiBody, ApiCreatedResponse, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AddressDto } from './dto/address.dto';

@Controller('contact')
@ApiTags('Contact')
export class ContactController {
    constructor(
        private readonly contactService: ContactService
    ) {}

    @Post('address')
    @ApiOperation({ summary: 'Create address' })
    @ApiBody({ schema: {
        type: 'object',
        properties: {
            province: {
                type: 'string'
            },
            city: {
                type: 'string'
            },
            district: {
                type: 'string'
            },
            details: {
                type: 'string'
            }
        }
    } })
    @ApiResponse({ type: AddressDto, status: 200 })
    createAddress(@Body() param: {
        province: string,
        city: string,
        district: string,
        details: string
    }): Promise<AddressDto> {
        return this.contactService.createAddress(param);
    }

    @Put('address')
    @ApiOperation({ summary: 'Update address' })
    @ApiBody({ schema: {
        type: 'object',
        properties: {
            id: {
                type: 'number'
            },
            province: {
                type: 'string',
                nullable: true
            },
            city: {
                type: 'string',
                nullable: true
            },
            district: {
                type: 'string',
                nullable: true
            },
            details: {
                type: 'string',
                nullable: true
            }
        }
    }})
    @ApiResponse({ type: AddressDto })
    updateAddress(@Body() param: {
        id: number,
        province?: string,
        city?: string,
        district?: string,
        details?: string
    }): Promise<AddressDto> {
        return this.contactService.updateAddress(param);
    }

    @Get('address')
    @ApiOperation({ summary: 'Get address' })
    @ApiQuery({ name: 'id', type: 'number' })
    getAddress(@Query('id') id): Promise<AddressDto> {
        return this.contactService.getAddress(id);
    }

    @Post()
    @ApiOperation({ summary: 'Create contact' })
    @ApiBody({ schema: {
        type: 'object',
        properties: {
            phone: {
                type: 'string'
            },
            addressId: {
                type: 'number'
            }
        }
    }})
    createContact(@Body() param: {
        phone: string,
        addressId: number
    }): Promise<any> {
        return this.contactService.createContact(param);
    }

    @Put()
    @ApiOperation({ summary: 'Update contact' })
    @ApiBody({ schema: {
        type: 'object',
        properties: {
            id: {
                type: 'number'
            },
            phone: {
                type: 'string'
            }
        }
    }})
    updateContact(@Body() param: {
        id: number,
        phone: string,
    }) {
        return this.contactService.updateContact(param);
    }

    @Get()
    @ApiOperation({ summary: 'Get contact' })
    @ApiQuery({ name: 'id', type: 'number' })
    getContact(@Query('id') id): Promise<any> {
        return this.contactService.getContact(id);
    }

}
