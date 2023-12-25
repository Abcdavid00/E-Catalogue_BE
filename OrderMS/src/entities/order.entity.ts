import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Item } from "./item.entity";

export enum DeliverStatus {
    PENDING = 'pending',
    DELIVERING = 'delivering',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled',
}

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('int', {nullable: false})
    user_id: number;

    @Column('int', {nullable: false})
    contact_id: number;

    @ManyToMany(() => Item)
    items: Item[];

    @Column('int', {nullable: false})
    total_price: number;

    @Column('enum', {enum: DeliverStatus, default: DeliverStatus.PENDING})
    deliver_status: DeliverStatus;
}