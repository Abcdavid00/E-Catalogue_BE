import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ContentType } from "./content-type.enum";
import { FavoriteCollection } from "./favorite-collection.entity";

@Entity()
export class Favorite {
    @PrimaryGeneratedColumn()
    id: number;

    // @Column('int', { nullable: false })
    // userId: number;

    @Column('int', { nullable: false })
    contentId: number;

    @Column('enum', { enum: ContentType, nullable: false })
    contentType: ContentType;

    @ManyToOne(() => FavoriteCollection, collection => collection.favorites, { onDelete: 'CASCADE', nullable: false})
    collection: FavoriteCollection;
}