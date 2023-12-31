import { Body, Controller, Get, Post, Put, Query, UseGuards, Request } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AddressDto } from './dto/address.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

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
            district: {
                type: 'string',
                nullable: true
            },
            ward: {
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
        district?: string,
        ward?: string,
        details?: string
    }): Promise<AddressDto> {
        return this.contactService.updateAddress({
            id: param.id,
            province: param.province,
            city: param.district,
            district: param.ward,
            details: param.details
        });
    }

    @Get('address')
    @ApiOperation({ summary: 'Get address' })
    @ApiQuery({ name: 'id', type: 'number' })
    getAddress(@Query('id') id): Promise<AddressDto> {
        return this.contactService.getAddress(id);
    }

    @Post()
    @ApiOperation({ summary: 'Create contact (User required)' })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiBody({ schema: {
        type: 'object',
        properties: {
            phone: {
                type: 'string'
            },
            fullname: {
                type: 'string'
            },
            addressId: {
                type: 'number'
            }
        }
    }})
    createContact(@Body() param: {
        phone: string,
        fullname?: string,
        addressId: number
    }, @Request() req): Promise<any> {
        const userId = req.user.id;
        return this.contactService.createContact({
            ...param,
            userId: userId
        });
    }

    @Post('full')
    @ApiOperation({ summary: 'Create contact full (User required)' })
    @ApiBody({ schema: {
        type: 'object',
        properties: {
            phone: {
                type: 'string'
            },
            fullname: {
                type: 'string'
            },
            province: {
                type: 'string'
            },
            district: {
                type: 'string'
            },
            ward: {
                type: 'string'
            },
            details: {
                type: 'string'
            }
        }
    }})
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    createContactFull(@Body() param: {
        phone: string,
        fullname: string,
        province: string,
        district: string,
        ward: string,
        details: string,
    }, @Request() req): Promise<any> {
        const userId = req.user.id;
        return this.contactService.createContactFull({
            phone: param.phone,
            fullname: param.fullname,
            province: param.province,
            city: param.district,
            district: param.ward,
            details: param.details,
            userId: userId
        });
    }

    @Get('user')
    @ApiOperation({ summary: 'Get user contact (User required)' })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    getUserContact(@Request() req): Promise<any> {
        const userId = req.user.id;
        return this.contactService.getContactByUserId({userId});
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
