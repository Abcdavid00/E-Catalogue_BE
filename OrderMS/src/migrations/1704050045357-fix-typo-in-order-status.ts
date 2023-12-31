import { MigrationInterface, QueryRunner } from "typeorm";

export class FixTypoInOrderStatus1704050045357 implements MigrationInterface {
    name = 'FixTypoInOrderStatus1704050045357'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`order\` CHANGE \`cancelled_date\` \`canceled_date\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`order\` CHANGE \`deliver_status\` \`deliver_status\` enum ('pending', 'delivering', 'delivered', 'canceled') NOT NULL DEFAULT 'pending'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`order\` CHANGE \`deliver_status\` \`deliver_status\` enum ('pending', 'delivering', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE \`order\` CHANGE \`canceled_date\` \`cancelled_date\` datetime NULL`);
    }

}
