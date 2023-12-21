import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateStore1703125479984 implements MigrationInterface {
    name = 'CreateStore1703125479984'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`store\` (\`id\` int NOT NULL, \`name\` varchar(50) NOT NULL, \`description\` varchar(5000) NULL, \`address\` int NULL, \`logo_image\` varchar(40) NULL, \`cover_image\` varchar(40) NULL, \`approved\` tinyint NOT NULL DEFAULT 0, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`product\` ADD \`storeId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`product\` ADD CONSTRAINT \`FK_32eaa54ad96b26459158464379a\` FOREIGN KEY (\`storeId\`) REFERENCES \`store\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product\` DROP FOREIGN KEY \`FK_32eaa54ad96b26459158464379a\``);
        await queryRunner.query(`ALTER TABLE \`product\` DROP COLUMN \`storeId\``);
        await queryRunner.query(`DROP TABLE \`store\``);
    }

}
