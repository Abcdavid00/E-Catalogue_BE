import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity()
export class ProductVariant {
    @PrimaryGeneratedColumn()
    id: number;
    
    @ManyToOne(() => Product, product => product.id, { nullable: false, onDelete: 'CASCADE'})
    product: Product;

    @Column('nvarchar', { length: 100, nullable: true })
    name?: string;

    @Column('varchar', { length: 40, nullable: true })
    image?: string;

    @Column('int', { nullable: false })
    price: number;
    
    @Column('int', { nullable: false })
    quantity: number;
}