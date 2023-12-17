import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";
import { Size } from "./size.enum";
import { Color } from "./color.enum";

@Entity()
export class ProductVariant {
    @PrimaryGeneratedColumn()
    id: number;
    
    @ManyToOne(() => Product, product => product.id, { nullable: false, onDelete: 'CASCADE'})
    product: Product;

    @Column({ type: 'enum', enum: Size, nullable: false })
    size: Size;

    @Column({ type: 'enum', enum: Color, nullable: false})
    color: Color;

    @Column('varchar', { length: 40, nullable: true })
    image?: string;

    @Column('int', { nullable: false })
    price: number;
    
    @Column('int', { nullable: false })
    quantity: number;
}