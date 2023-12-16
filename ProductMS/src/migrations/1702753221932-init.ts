import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1702753221932 implements MigrationInterface {
    name = 'Init1702753221932'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`category\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(50) NOT NULL, \`description\` varchar(5000) NULL, \`image\` varchar(40) NULL, \`parentId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`brand\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(50) NOT NULL, \`description\` varchar(5000) NULL, \`image\` varchar(40) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`product_variant\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(100) NULL, \`image\` varchar(40) NULL, \`price\` int NOT NULL, \`quantity\` int NOT NULL, \`productId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`product\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(50) NOT NULL, \`description\` varchar(5000) NULL, \`image\` varchar(40) NULL, \`categoryId\` int NOT NULL, \`brandId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`product_image\` (\`product\` int NOT NULL, \`image\` varchar(40) NOT NULL, \`productId\` int NOT NULL, PRIMARY KEY (\`product\`, \`image\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`category_closure\` (\`id_ancestor\` int NOT NULL, \`id_descendant\` int NOT NULL, INDEX \`IDX_4aa1348fc4b7da9bef0fae8ff4\` (\`id_ancestor\`), INDEX \`IDX_6a22002acac4976977b1efd114\` (\`id_descendant\`), PRIMARY KEY (\`id_ancestor\`, \`id_descendant\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`category\` ADD CONSTRAINT \`FK_d5456fd7e4c4866fec8ada1fa10\` FOREIGN KEY (\`parentId\`) REFERENCES \`category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`product_variant\` ADD CONSTRAINT \`FK_6e420052844edf3a5506d863ce6\` FOREIGN KEY (\`productId\`) REFERENCES \`product\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`product\` ADD CONSTRAINT \`FK_ff0c0301a95e517153df97f6812\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`product\` ADD CONSTRAINT \`FK_bb7d3d9dc1fae40293795ae39d6\` FOREIGN KEY (\`brandId\`) REFERENCES \`brand\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`product_image\` ADD CONSTRAINT \`FK_40ca0cd115ef1ff35351bed8da2\` FOREIGN KEY (\`productId\`) REFERENCES \`product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`category_closure\` ADD CONSTRAINT \`FK_4aa1348fc4b7da9bef0fae8ff48\` FOREIGN KEY (\`id_ancestor\`) REFERENCES \`category\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`category_closure\` ADD CONSTRAINT \`FK_6a22002acac4976977b1efd114a\` FOREIGN KEY (\`id_descendant\`) REFERENCES \`category\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`category_closure\` DROP FOREIGN KEY \`FK_6a22002acac4976977b1efd114a\``);
        await queryRunner.query(`ALTER TABLE \`category_closure\` DROP FOREIGN KEY \`FK_4aa1348fc4b7da9bef0fae8ff48\``);
        await queryRunner.query(`ALTER TABLE \`product_image\` DROP FOREIGN KEY \`FK_40ca0cd115ef1ff35351bed8da2\``);
        await queryRunner.query(`ALTER TABLE \`product\` DROP FOREIGN KEY \`FK_bb7d3d9dc1fae40293795ae39d6\``);
        await queryRunner.query(`ALTER TABLE \`product\` DROP FOREIGN KEY \`FK_ff0c0301a95e517153df97f6812\``);
        await queryRunner.query(`ALTER TABLE \`product_variant\` DROP FOREIGN KEY \`FK_6e420052844edf3a5506d863ce6\``);
        await queryRunner.query(`ALTER TABLE \`category\` DROP FOREIGN KEY \`FK_d5456fd7e4c4866fec8ada1fa10\``);
        await queryRunner.query(`DROP INDEX \`IDX_6a22002acac4976977b1efd114\` ON \`category_closure\``);
        await queryRunner.query(`DROP INDEX \`IDX_4aa1348fc4b7da9bef0fae8ff4\` ON \`category_closure\``);
        await queryRunner.query(`DROP TABLE \`category_closure\``);
        await queryRunner.query(`DROP TABLE \`product_image\``);
        await queryRunner.query(`DROP TABLE \`product\``);
        await queryRunner.query(`DROP TABLE \`product_variant\``);
        await queryRunner.query(`DROP TABLE \`brand\``);
        await queryRunner.query(`DROP TABLE \`category\``);
    }

}
