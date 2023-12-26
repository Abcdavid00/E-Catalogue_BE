import { MigrationInterface, QueryRunner } from "typeorm";

export class RatingIdToAuto1703620995861 implements MigrationInterface {
    name = 'RatingIdToAuto1703620995861'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`rating\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`rating\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`rating\` ADD \`id\` int NOT NULL PRIMARY KEY AUTO_INCREMENT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`rating\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`rating\` ADD \`id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`rating\` ADD PRIMARY KEY (\`id\`)`);
    }

}
