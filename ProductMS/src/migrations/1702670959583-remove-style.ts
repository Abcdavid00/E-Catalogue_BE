import { MigrationInterface, QueryRunner } from "typeorm"

export class RemoveStyle1702670959583 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product_styles_style\` DROP FOREIGN KEY \`FK_dff9baccc560609eb6f7b27d0f9\``);
        await queryRunner.query(`ALTER TABLE \`product_styles_style\` DROP FOREIGN KEY \`FK_7b847e74bde0a591b0bcf2e0477\``);
        await queryRunner.query(`DROP INDEX \`IDX_dff9baccc560609eb6f7b27d0f\` ON \`product_styles_style\``);
        await queryRunner.query(`DROP INDEX \`IDX_7b847e74bde0a591b0bcf2e047\` ON \`product_styles_style\``);
        await queryRunner.query(`DROP TABLE \`style\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`style\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(50) NOT NULL, \`description\` varchar(5000) NULL, \`image\` varchar(40) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`product_styles_style\` (\`productId\` int NOT NULL, \`styleId\` int NOT NULL, INDEX \`IDX_7b847e74bde0a591b0bcf2e047\` (\`productId\`), INDEX \`IDX_dff9baccc560609eb6f7b27d0f\` (\`styleId\`), PRIMARY KEY (\`productId\`, \`styleId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`product_styles_style\` ADD CONSTRAINT \`FK_7b847e74bde0a591b0bcf2e0477\` FOREIGN KEY (\`productId\`) REFERENCES \`product\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`product_styles_style\` ADD CONSTRAINT \`FK_dff9baccc560609eb6f7b27d0f9\` FOREIGN KEY (\`styleId\`) REFERENCES \`style\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
