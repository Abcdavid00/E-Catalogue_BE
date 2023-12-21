import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity()
export class Store {
    @PrimaryColumn('int', { unique: true, nullable: false })
    id: number;

    @Column('nvarchar', { length: 50 })
    name?: string;

    @Column('nvarchar', { length: 5000, nullable: true})
    description?: string;

    @Column('int', { nullable: true })
    address?: number;

    @Column('varchar', { length: 40, nullable: true })
    logo_image?: string;

    @Column('varchar', { length: 40, nullable: true })
    cover_image?: string;

    @OneToMany(() => Product, product => product.store)
    products?: Product[];

    @Column('boolean', { default: false })
    approved?: boolean;
}