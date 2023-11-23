import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

enum UserRole {
    ADMIN = 'admin',
    SHOP_OWNER = 'shop_owner',
    CUSTOMER = 'customer',
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ 
        type: 'enum',
        enum: UserRole,
        default: UserRole.CUSTOMER,
    })
    role: UserRole;
}
