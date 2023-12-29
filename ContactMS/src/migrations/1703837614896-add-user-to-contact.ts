import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserToContact1703837614896 implements MigrationInterface {
    name = 'AddUserToContact1703837614896'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`contact\` ADD \`user_id\` int NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`contact\` DROP COLUMN \`user_id\``);
    }

}
