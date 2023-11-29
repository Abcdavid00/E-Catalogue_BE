import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum UserRole {
    ADMIN = 'admin',
    SHOP_OWNER = 'shop_owner',
    CUSTOMER = 'customer',
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', { length: 30, unique: true })
    username: string;

    @Column('varchar', { length: 30, unique: true })
    email: string;

    @Column('varchar', { length: 200, nullable: false })
    password?: string;

    @Column({ 
        type: 'enum',
        enum: UserRole,
        default: UserRole.CUSTOMER,
    })
    role: UserRole;
}
