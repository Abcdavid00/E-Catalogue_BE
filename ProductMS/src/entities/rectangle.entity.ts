import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Style } from "./style.entity";
import { ProductVariant } from "./product-variant.entity";

@Entity()
export class Rectangle {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Style, style => style.id, { nullable: false, onDelete: 'CASCADE', cascade: true })
    style: Style;

    @Column('double', { nullable: false })
    minX: number;

    @Column('double', { nullable: false })
    minY: number;

    @Column('double', { nullable: false })
    maxX: number;

    @Column('double', { nullable: false })
    maxY: number;

    @ManyToOne(() => ProductVariant, variant => variant.id, { nullable: false, cascade: true })
    variant: ProductVariant;
}