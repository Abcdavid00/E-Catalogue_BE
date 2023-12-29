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
        fullname?: string,
        addressId: number,
        userId: number,
    }): Promise<any> {
        return this.send({
            cmd: 'CreateContact',
            data: param
        })
    }

    async createContactFull(param: {
        phone: string,
        fullname?: string,
        province: string,
        city: string,
        district: string,
        details: string,
        userId: number,
    }): Promise<any> {
        return this.send({
            cmd: 'createContactFull',
            data: param
        })
    }

    async getContactByUserId(param: {
        userId: number,
    }): Promise<any> {
        return this.send({
            cmd: 'getContactByUserId',
            data: param
        })
    }

    async updateContact(param: {
        id: number,
        phone: string,
        fullname?: string,
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
