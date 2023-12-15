import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity()
export class ProductVariant {
    @PrimaryColumn()
    @ManyToOne(() => Product, product => product.id, { nullable: false })
    product: number;

    @PrimaryColumn()
    @Column('nvarchar', { length: 100, nullable: true })
    name?: string;

    @Column('varchar', { length: 40, nullable: true })
    image?: string;

    @Column('int', { nullable: false })
    price: number;
    
    @Column('int', { nullable: false })
    quantity: number;
}