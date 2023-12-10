import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum Sex {
    MALE = 'male',
    FEMALE = 'female',
    UNKNOWN = 'unknown',
}

@Entity()
export class UserInfo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('nvarchar', { length: 50 })
    fullname?: string;

    @Column('varchar', { length: 10 })
    phone?: string;

    @Column({
        type: 'enum',
        enum: Sex,
        default: Sex.UNKNOWN,
    })
    sex?: boolean;

    @Column('date')
    dob?: Date;

    @Column('varchar', { length: 40 })
    profile_image?: string;
}