import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateProductVariant1702787896757 implements MigrationInterface {
    name = 'UpdateProductVariant1702787896757'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product_variant\` DROP COLUMN \`name\``);
        await queryRunner.query(`ALTER TABLE \`product_variant\` ADD \`size\` enum ('XS', 'S', 'M', 'L', 'XL', 'XXL') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`product_variant\` ADD \`color\` enum ('Whites', 'Blacks', 'Greys', 'Beiges', 'Browns', 'Reds', 'Greens', 'Blues', 'Purples', 'Yellows', 'Pinks', 'Oranges') NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product_variant\` DROP COLUMN \`color\``);
        await queryRunner.query(`ALTER TABLE \`product_variant\` DROP COLUMN \`size\``);
        await queryRunner.query(`ALTER TABLE \`product_variant\` ADD \`name\` varchar(100) NULL`);
    }

}
