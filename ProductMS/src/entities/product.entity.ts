import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "./category.entity";
import { Brand } from "./brand.entity";
import { ProductVariant } from "./product-variant.entity";
import { ProductImage } from "./product-image.entity";
import { Store } from "./store.entity";

@Entity()
export class Product {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Store, store => store.id, { nullable: false })
    store: Store;

    @ManyToOne(() => Category, category => category.id, { nullable: false })
    category: Category;

    @ManyToOne(() => Brand, brand => brand.id, { nullable: true })
    brand: Brand;

    @Column('nvarchar', { length: 50 , nullable: false})
    name: string;

    @Column('nvarchar', { length: 5000, nullable: true })
    description?: string;

    @Column('varchar', { length: 40, nullable: true })
    image: string;

    @OneToMany(() => ProductVariant, variant => variant.product)
    variants: ProductVariant[];

    @OneToMany(() => ProductImage, image => image.product)
    images: ProductImage[];
}