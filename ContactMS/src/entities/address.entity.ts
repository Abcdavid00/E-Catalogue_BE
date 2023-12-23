import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Address {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('nvarchar', { length: 50, nullable: false })
    province: string;

    @Column('nvarchar', { length: 50, nullable: false })
    city: string;

    @Column('nvarchar', { length: 50, nullable: false })
    district: string;

    @Column('nvarchar', { length: 500, nullable: false })
    details: string;
}