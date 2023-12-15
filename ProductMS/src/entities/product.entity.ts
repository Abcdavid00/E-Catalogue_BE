import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "./category.entity";
import { Style } from "./style.entity";
import { Brand } from "./brand.entity";

@Entity()
export class Product {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Category, category => category.id, { nullable: false })
    category: number;

    @ManyToMany(() => Style, style => style.id)
    @JoinTable()
    styles: Style[];

    @ManyToOne(() => Brand, brand => brand.id, { nullable: true })
    brand: number;

    @Column('nvarchar', { length: 50 , nullable: false})
    name: string;

    @Column('nvarchar', { length: 5000, nullable: true })
    description?: string;
}