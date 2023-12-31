import { RpcException } from "@nestjs/microservices";

export enum DeliverStatus {
    PENDING = 'pending',
    DELIVERING = 'delivering',
    DELIVERED = 'delivered',
    CANCELED = 'canceled',
}

export function parseDeliverStatus(status: string): DeliverStatus {
    const statusEnum = DeliverStatus[status.toUpperCase()];
    if (!statusEnum) {
        throw new RpcException(`Invalid deliver status: ${status}`);
    }
    return statusEnum;
}