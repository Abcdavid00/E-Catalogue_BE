import { MigrationInterface, QueryRunner } from "typeorm";

export class FixOrderDateTypo1703876728555 implements MigrationInterface {
    name = 'FixOrderDateTypo1703876728555'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`order\` CHANGE \`order_data\` \`order_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`order\` CHANGE \`order_date\` \`order_data\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
    }

}
