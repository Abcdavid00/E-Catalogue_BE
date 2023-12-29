import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateOrder1703769890611 implements MigrationInterface {
    name = 'UpdateOrder1703769890611'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`order\` ADD \`store_id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD \`order_data\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD \`delivery_date\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD \`delivered_date\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD \`cancelled_date\` datetime NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`order\` DROP COLUMN \`cancelled_date\``);
        await queryRunner.query(`ALTER TABLE \`order\` DROP COLUMN \`delivered_date\``);
        await queryRunner.query(`ALTER TABLE \`order\` DROP COLUMN \`delivery_date\``);
        await queryRunner.query(`ALTER TABLE \`order\` DROP COLUMN \`order_data\``);
        await queryRunner.query(`ALTER TABLE \`order\` DROP COLUMN \`store_id\``);
    }

}
