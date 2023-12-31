import { DynamicModule } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";

export const UsersMSName = "USERSMS"
const UsersMSHost = process.env.USERSMS_HOST
const UsersMSPort = parseInt(process.env.USERSMS_PORT, 10)

export const UserInfoMSName = "USERINFOMS"
const UserInfoMSHost = process.env.USERINFOMS_HOST
const UserInfoMSPort = parseInt(process.env.USERINFOMS_PORT, 10)

export const ProductMSName = "PRODUCTMS"
const ProductMSHost = process.env.PRODUCTMS_HOST
const ProductMSPort = parseInt(process.env.PRODUCTMS_PORT, 10)

export const ContactMSName = "CONTACTMS"
const ContactMSHost = process.env.CONTACTMS_HOST
const ContactMSPort = parseInt(process.env.CONTACTMS_PORT, 10)

export const OrderMSName = "ORDERMS"
const OrderMSHost = process.env.ORDERMS_HOST
const OrderMSPort = parseInt(process.env.ORDERMS_PORT, 10)

const clientsModule: DynamicModule = ClientsModule.register([
    {
        name: UsersMSName,
        transport: Transport.TCP,
        options: {
            host: UsersMSHost,
            port: UsersMSPort
        }
    },
    {
        name: UserInfoMSName,
        transport: Transport.TCP,
        options: {
            host: UserInfoMSHost,
            port: UserInfoMSPort
        }
    },
    {
        name: ProductMSName,
        transport: Transport.TCP,
        options: {
            host: ProductMSHost,
            port: ProductMSPort
        }
    },
    {
        name: ContactMSName,
        transport: Transport.TCP,
        options: {
            host: ContactMSHost,
            port: ContactMSPort
        }
    },
    {
        name: OrderMSName,
        transport: Transport.TCP,
        options: {
            host: OrderMSHost,
            port: OrderMSPort
        }
    }
])

export default clientsModule