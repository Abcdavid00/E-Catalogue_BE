import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Rectangle } from "./rectangle.entity";
import { Store } from "./store.entity";
import { StyleImage } from "./style-image.entity";
import { StyleCategory } from "./style-category.enum";

@Entity()
export class Style {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('nvarchar', { length: 150, nullable: false })
    name: string;

    @Column('enum', { enum: StyleCategory, nullable: false })
    category: StyleCategory;

    @ManyToOne(() => Store, store => store.id, { nullable: false })
    store: Store;

    @Column('varchar', { nullable: false, length: 40 })
    mainImage: string;

    @Column('int', { nullable: false })
    width: number;

    @Column('int', { nullable: false })
    height: number;

    @OneToMany(() => Rectangle, rectangle => rectangle.style)
    rectangles: Rectangle[];

    @OneToMany(() => StyleImage, styleImage => styleImage.style)
    images: StyleImage[];
}