import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1702661612105 implements MigrationInterface {
    name = 'Init1702661612105'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`style\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(50) NOT NULL, \`description\` varchar(5000) NULL, \`image\` varchar(40) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`brand\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(50) NOT NULL, \`description\` varchar(5000) NULL, \`image\` varchar(40) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`product\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(50) NOT NULL, \`description\` varchar(5000) NULL, \`image\` varchar(40) NULL, \`categoryId\` int NOT NULL, \`brandId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`category\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(50) NOT NULL, \`description\` varchar(5000) NULL, \`image\` varchar(40) NULL, \`parentId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`product_image\` (\`product\` int NOT NULL, \`image\` varchar(40) NOT NULL, \`productId\` int NOT NULL, PRIMARY KEY (\`product\`, \`image\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`product_variant\` (\`product\` int NOT NULL, \`name\` varchar(100) NULL, \`image\` varchar(40) NULL, \`price\` int NOT NULL, \`quantity\` int NOT NULL, \`productId\` int NOT NULL, PRIMARY KEY (\`product\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`product_styles_style\` (\`productId\` int NOT NULL, \`styleId\` int NOT NULL, INDEX \`IDX_7b847e74bde0a591b0bcf2e047\` (\`productId\`), INDEX \`IDX_dff9baccc560609eb6f7b27d0f\` (\`styleId\`), PRIMARY KEY (\`productId\`, \`styleId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`product\` ADD CONSTRAINT \`FK_ff0c0301a95e517153df97f6812\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`product\` ADD CONSTRAINT \`FK_bb7d3d9dc1fae40293795ae39d6\` FOREIGN KEY (\`brandId\`) REFERENCES \`brand\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`category\` ADD CONSTRAINT \`FK_d5456fd7e4c4866fec8ada1fa10\` FOREIGN KEY (\`parentId\`) REFERENCES \`category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`product_image\` ADD CONSTRAINT \`FK_40ca0cd115ef1ff35351bed8da2\` FOREIGN KEY (\`productId\`) REFERENCES \`product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`product_variant\` ADD CONSTRAINT \`FK_6e420052844edf3a5506d863ce6\` FOREIGN KEY (\`productId\`) REFERENCES \`product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`product_styles_style\` ADD CONSTRAINT \`FK_7b847e74bde0a591b0bcf2e0477\` FOREIGN KEY (\`productId\`) REFERENCES \`product\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`product_styles_style\` ADD CONSTRAINT \`FK_dff9baccc560609eb6f7b27d0f9\` FOREIGN KEY (\`styleId\`) REFERENCES \`style\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product_styles_style\` DROP FOREIGN KEY \`FK_dff9baccc560609eb6f7b27d0f9\``);
        await queryRunner.query(`ALTER TABLE \`product_styles_style\` DROP FOREIGN KEY \`FK_7b847e74bde0a591b0bcf2e0477\``);
        await queryRunner.query(`ALTER TABLE \`product_variant\` DROP FOREIGN KEY \`FK_6e420052844edf3a5506d863ce6\``);
        await queryRunner.query(`ALTER TABLE \`product_image\` DROP FOREIGN KEY \`FK_40ca0cd115ef1ff35351bed8da2\``);
        await queryRunner.query(`ALTER TABLE \`category\` DROP FOREIGN KEY \`FK_d5456fd7e4c4866fec8ada1fa10\``);
        await queryRunner.query(`ALTER TABLE \`product\` DROP FOREIGN KEY \`FK_bb7d3d9dc1fae40293795ae39d6\``);
        await queryRunner.query(`ALTER TABLE \`product\` DROP FOREIGN KEY \`FK_ff0c0301a95e517153df97f6812\``);
        await queryRunner.query(`DROP INDEX \`IDX_dff9baccc560609eb6f7b27d0f\` ON \`product_styles_style\``);
        await queryRunner.query(`DROP INDEX \`IDX_7b847e74bde0a591b0bcf2e047\` ON \`product_styles_style\``);
        await queryRunner.query(`DROP TABLE \`product_styles_style\``);
        await queryRunner.query(`DROP TABLE \`product_variant\``);
        await queryRunner.query(`DROP TABLE \`product_image\``);
        await queryRunner.query(`DROP TABLE \`category\``);
        await queryRunner.query(`DROP TABLE \`product\``);
        await queryRunner.query(`DROP TABLE \`brand\``);
        await queryRunner.query(`DROP TABLE \`style\``);
    }

}
