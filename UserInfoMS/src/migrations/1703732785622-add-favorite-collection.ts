import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFavoriteCollection1703732785622 implements MigrationInterface {
    name = 'AddFavoriteCollection1703732785622'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`favorite_collection\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userId\` int NOT NULL, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`favorite\` ADD \`collectionId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`favorite\` ADD CONSTRAINT \`FK_5bc365f0d573858749687018164\` FOREIGN KEY (\`collectionId\`) REFERENCES \`favorite_collection\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`favorite\` DROP FOREIGN KEY \`FK_5bc365f0d573858749687018164\``);
        await queryRunner.query(`ALTER TABLE \`favorite\` DROP COLUMN \`collectionId\``);
        await queryRunner.query(`DROP TABLE \`favorite_collection\``);
    }

}
