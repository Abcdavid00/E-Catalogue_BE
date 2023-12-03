import { DynamicModule } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";


export const UsersMSName = "USERSMS"
const UsersMSHost = process.env.USERSMS_HOST
const UsersMSPort = parseInt(process.env.USERSMS_PORT, 10)

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