import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Style } from "./style.entity";

@Entity()
export class StyleImage {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Style, style => style.id, { nullable: false, onDelete: 'CASCADE', cascade: true })
    style: Style;

    @Column('varchar', { nullable: false, length: 40 })
    image: string;
}