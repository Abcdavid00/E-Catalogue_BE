import { MigrationInterface, QueryRunner } from "typeorm";

export class FixRefAsNumber1702721587366 implements MigrationInterface {
    name = 'FixRefAsNumber1702721587366'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product_variant\` CHANGE \`product\` \`id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`product_variant\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`product_variant\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`product_variant\` ADD \`id\` int NOT NULL PRIMARY KEY AUTO_INCREMENT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product_variant\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`product_variant\` ADD \`id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`product_variant\` ADD PRIMARY KEY (\`id\`)`);
        await queryRunner.query(`ALTER TABLE \`product_variant\` CHANGE \`id\` \`product\` int NOT NULL`);
    }

}
