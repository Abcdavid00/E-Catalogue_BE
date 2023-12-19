import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Brand {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('nvarchar', { length: 50, nullable: false })
    name: string;

    @Column('nvarchar', { length: 5000, nullable: true })
    description?: string;

    @Column('varchar', { length: 40, nullable: true })
    image?: string;
}
