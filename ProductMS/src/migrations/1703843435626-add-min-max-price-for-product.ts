import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMinMaxPriceForProduct1703843435626 implements MigrationInterface {
    name = 'AddMinMaxPriceForProduct1703843435626'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product\` ADD \`minPrice\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`product\` ADD \`maxPrice\` int NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product\` DROP COLUMN \`maxPrice\``);
        await queryRunner.query(`ALTER TABLE \`product\` DROP COLUMN \`minPrice\``);
    }

}
