import { Column, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, Tree, TreeChildren, TreeParent } from "typeorm";
import { Product } from "./product.entity";

@Entity()
@Tree("closure-table")
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @TreeParent()
    parent?: Category;

    @TreeChildren()
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