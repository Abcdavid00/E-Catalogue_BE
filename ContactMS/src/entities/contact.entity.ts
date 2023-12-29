import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Address } from "./address.entity";

@Entity()
export class Contact {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('nvarchar', { length: 10, nullable: false })
    phone: string;

    @OneToOne(() => Address)
    @JoinColumn()
    address: Address;

    @Column('int', { nullable: false })
    user_id: number;
}