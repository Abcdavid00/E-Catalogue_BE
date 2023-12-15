import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity()
export class Style {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('nvarchar', { length: 50, nullable: false })
    name: string;

    @Column('nvarchar', { length: 5000, nullable: true })
    description?: string;

    @Column('varchar', { length: 40, nullable: true })
    image?: string;

    @ManyToMany(() => Product, product => product.styles)
    products: Product[];
}