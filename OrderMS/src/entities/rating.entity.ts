import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";

@Entity()
export class Rating {
    @PrimaryColumn('int', { unique: true, nullable: false })
    id: number;

    @ManyToOne(() => Order)
    // @JoinColumn({ name: 'order_id' })
    order: Order;

    @Column('int', { nullable: false })
    product_variant: number;

    @Column('int', { nullable: false })
    rate: number;

    @Column('nvarchar', { length: 500, nullable: true })
    comment?: string;
}