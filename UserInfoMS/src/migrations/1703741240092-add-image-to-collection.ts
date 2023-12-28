import { MigrationInterface, QueryRunner } from "typeorm";

export class AddImageToCollection1703741240092 implements MigrationInterface {
    name = 'AddImageToCollection1703741240092'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`favorite_collection\` ADD \`image\` varchar(40) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`favorite_collection\` DROP COLUMN \`image\``);
    }

}
