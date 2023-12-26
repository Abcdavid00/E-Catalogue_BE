import { Entity, JoinTable, ManyToMany, PrimaryColumn } from "typeorm";
import { Item } from './item.entity';

@Entity()
export class Cart {
    @PrimaryColumn('int', { unique: true, nullable: false })
    id: number;

    @ManyToMany(() => Item)
    @JoinTable()
    items: Item[];
}