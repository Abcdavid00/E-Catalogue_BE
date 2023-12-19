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
    }
])

export default clientsModule