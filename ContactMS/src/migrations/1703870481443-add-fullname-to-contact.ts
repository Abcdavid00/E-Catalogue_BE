import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFullnameToContact1703870481443 implements MigrationInterface {
    name = 'AddFullnameToContact1703870481443'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`contact\` ADD \`fullname\` varchar(100) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`contact\` DROP COLUMN \`fullname\``);
    }

}
