import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTimestampForRating1703525980594 implements MigrationInterface {
    name = 'AddTimestampForRating1703525980594'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`rating\` ADD \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`rating\` DROP COLUMN \`created_at\``);
    }

}
