import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { Repository } from 'typeorm';
import { Contact } from './entities/contact.entity';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AppService {

  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>
  ) {}
  
  getHello(): string {
    return 'ContactMS Online!';
  }

  createAddress(param: {
    province: string,
    city: string,
    district: string,
    details: string
  }): Promise<Address> {
    if (!param.province) {
      throw new RpcException('Province is required');
    }
    if (!param.city) {
      throw new RpcException('City is required');
    }
    if (!param.district) {
      throw new RpcException('District is required');
    }
    const address = this.addressRepository.create(param);
    return this.addressRepository.save(address);
  }

  async updateAddress(param: {
    id: number,
    province?: string,
    city?: string,
    district?: string,
    details?: string
  }) {
    if (!param.id) {
      throw new RpcException('Id is required');
    }
    const address = await this.addressRepository.findOne({
      where: {
        id: param.id
      }
    });
    if (!address) {
      throw new Error('Address not found');
    }
    if (param.province) {
      address.province = param.province;
    }
    if (param.city) {
      address.city = param.city;
    }
    if (param.district) {
      address.district = param.district;
    }
    if (param.details) {
      address.details = param.details;
    }
    return this.addressRepository.save(address);
  }

  getAddress(param: {
    id: number,
  }): Promise<Address> {
    return this.addressRepository.findOne({
      where: {
        id: param.id
      }
    });
  }

  async createContact(param: {
    phone: string,
    addressId: number
  }): Promise<Contact> {
    if (!param.phone) {
      throw new RpcException('Phone is required');
    }
    if (!param.addressId) {
      throw new RpcException('Address is required');
    }
    const address = await this.addressRepository.findOne({
      where: {
        id: param.addressId
      }
    })
    if (!address) {
      throw new Error('Address not found');
    }
    const contact = this.contactRepository.create({
      phone: param.phone,
      address: address
    })
    return this.contactRepository.save(contact);
  }

  async updateContact(param: {
    id: number,
    phone: string,
  }) {
    if (!param.id) {
      throw new RpcException('Id is required');
    }
    const contact = await this.contactRepository.findOne({
      where: {
        id: param.id
      }
    });
    if (!contact) {
      throw new Error('Contact not found');
    }
    contact.phone = param.phone;
    return this.contactRepository.save(contact);
  }

  async getContact(param: {
    id: number,
  }): Promise<Contact> {
    return this.contactRepository.findOne({
      where: {
        id: param.id
      },
      relations: {
        address: true
      }
    });
  }
}
