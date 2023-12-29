import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Item } from "./item.entity";
import { DeliverStatus } from "./deliver-status.enum";

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('int', {nullable: false})
    store_id: number;

    @Column('int', {nullable: false})
    user_id: number;

    @Column('int', {nullable: false})
    contact_id: number;

    @ManyToMany(() => Item)
    @JoinTable()
    items: Item[];

    @Column('int', {nullable: false})
    total_price: number;

    @Column('enum', {enum: DeliverStatus, default: DeliverStatus.PENDING})
    deliver_status: DeliverStatus;

    @CreateDateColumn()
    order_data: Date;

    @Column('datetime', {nullable: true})
    delivery_date: Date;

    @Column('datetime', {nullable: true})
    delivered_date: Date;

    @Column('datetime', {nullable: true})
    cancelled_date: Date;
}