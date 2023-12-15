import { Column, Entity, JoinTable, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Category, category => category.id, { nullable: true })
    parent?: number;

    @OneToMany(() => Category, category => category.id)
    children: Category[];
    
    @OneToMany(() => Product, product => product.category)
    products: Product[];

    @Column('nvarchar', { length: 50, nullable: false })
    name: string;

    @Column('nvarchar', { length: 5000, nullable: true })
    description?: string;

    @Column('varchar', { length: 40, nullable: true })
    image?: string;
}