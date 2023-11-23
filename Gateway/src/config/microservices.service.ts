import { DynamicModule } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";


export const UsersMSName = "USERSMS"
const UsersMSHost = process.env.USERSMS_HOST || 'localhost'
const UsersMSPort = parseInt(process.env.USERSMS_PORT, 10) || 3000

const clientsModule: DynamicModule = ClientsModule.register([
    {
        name: UsersMSName,
        transport: Transport.TCP,
        options: {
            host: UsersMSHost,
            port: UsersMSPort
        }
    }
])

export default clientsModule