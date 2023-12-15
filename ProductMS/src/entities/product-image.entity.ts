import { Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity()
export class ProductImage {

    @PrimaryColumn()
    @ManyToOne(() => Product, product => product.id, { nullable: false })
    product: number;

    @PrimaryColumn({
        type: 'varchar',
        length: 40,
        nullable: false
    })
    image: string;
}