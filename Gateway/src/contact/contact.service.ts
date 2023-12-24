import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ContactMSName } from '../config/microservices.module';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AddressDto } from './dto/address.dto';

@Injectable()
export class ContactService {
    constructor(
        @Inject(ContactMSName)
        private readonly contactClient: ClientProxy
    ) {}

    async send(param: {
        cmd: string,
        data: any
    }): Promise<any> {
        try {
            const res = await firstValueFrom(
                this.contactClient.send<any>({ cmd: param.cmd }, param.data)
            )
            return res;
        } catch (error) {
            throw new BadRequestException('ContactMS: ' + error.message);
        }
    }

    async createAddress(param: {
        province: string,
        city: string,
        district: string,
        details: string
    }): Promise<AddressDto> {
        return this.send({
            cmd: 'CreateAddress',
            data: param
        })
    }

    async updateAddress(param: {
        id: number,
        province?: string,
        city?: string,
        district?: string,
        details?: string
    }): Promise<AddressDto> {
        return this.send({
            cmd: 'UpdateAddress',
            data: param
        })
    }

    async getAddress(id: number): Promise<AddressDto> {
        return this.send({
            cmd: 'GetAddress',
            data: {id}
        })
    }

    async createContact(param: {
        phone: string,
        addressId: number
    }): Promise<any> {
        return this.send({
            cmd: 'CreateContact',
            data: param
        })
    }

    async updateContact(param: {
        id: number,
        phone: string,
    }) {
        return this.send({
            cmd: 'UpdateContact',
            data: param
        })
    }

    async getContact(id: number): Promise<any> {
        return this.send({
            cmd: 'GetContact',
            data: {id}
        })
    }
}
