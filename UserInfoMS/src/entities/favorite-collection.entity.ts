import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Favorite } from "./favorite.entity";

@Entity()
export class FavoriteCollection {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('int', { nullable: false })
    userId: number;

    @Column('nvarchar', { nullable: false })
    name: string;

    @Column('varchar', { length: 40, nullable: false })
    image: string;

    @OneToMany(() => Favorite, favorite => favorite.collection)
    favorites: Favorite[];
}