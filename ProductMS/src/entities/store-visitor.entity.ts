import { Entity, PrimaryColumn } from "typeorm";

@Entity()
export class StoreVisitor {
    @PrimaryColumn()
    storeId: number;

    @PrimaryColumn()
    userId: number;
}