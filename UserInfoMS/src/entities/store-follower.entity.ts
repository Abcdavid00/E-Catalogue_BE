import { Entity, PrimaryColumn } from "typeorm";

@Entity()
export class StoreFollower {
    @PrimaryColumn('int', {nullable: false})
    storeId: number;

    @PrimaryColumn('int', {nullable: false})
    userId: number;
}