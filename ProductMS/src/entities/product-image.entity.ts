import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity()
export class ProductImage {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Product, product => product.id, { nullable: false, onDelete: 'CASCADE' })
    product: Product;

    @Column('varchar', { length: 40, nullable: false })
    image: string;
}