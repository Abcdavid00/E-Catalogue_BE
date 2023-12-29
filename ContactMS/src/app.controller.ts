import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @MessagePattern({ cmd: 'Hi' })
  ping(_: any): string {
    return this.appService.getHello();
  }

  @MessagePattern({ cmd: 'CreateAddress' })
  createAddress(param: {
    province: string,
    city: string,
    district: string,
    details: string
  }): Promise<any> {
    return this.appService.createAddress(param);
  }

  @MessagePattern({ cmd: 'UpdateAddress' })
  updateAddress(param: {
    id: number,
    province?: string,
    city?: string,
    district?: string,
    details?: string
  }) {
    return this.appService.updateAddress(param);
  }

  @MessagePattern({ cmd: 'GetAddress' })
  getAddress(param: {
    id: number,
  }): Promise<any> {
    return this.appService.getAddress(param);
  }

  @MessagePattern({ cmd: 'createContactFull' })
  createContactFull(param: {
    phone: string,
    fullname?: string,
    province: string,
    city: string,
    district: string,
    details: string,
    userId: number,
  }): Promise<any> {
    return this.appService.createContactFull(param);
  }

  @MessagePattern({ cmd: 'CreateContact' })
  createContact(param: {
    phone: string,
    fullname?: string,
    addressId: number,
    userId: number,
  }): Promise<any> {
    return this.appService.createContact(param);
  }

  @MessagePattern({ cmd: 'getContactByUserId' })
  getContactByUserId(param: {
    userId: number,
  }): Promise<any> {
    return this.appService.getContactByUserId(param);
  }

  @MessagePattern({ cmd: 'UpdateContact' })
  updateContact(param: {
    id: number,
    fullname?: string,
    phone: string,
  }) {
    return this.appService.updateContact(param);
  }

  @MessagePattern({ cmd: 'GetContact' })
  getContact(param: {
    id: number,
  }): Promise<any> {
    return this.appService.getContact(param);
  }
}
