import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

export enum Sex {
    MALE = 'male',
    FEMALE = 'female',
    UNKNOWN = 'unknown',
}

@Entity()
export class UserInfo {
    @PrimaryColumn('int', { unique: true, nullable: false })
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

    @Column('date', { nullable: true })
    dob?: Date;

    @Column('varchar', { length: 40, nullable: true })
    profile_image?: string;
}