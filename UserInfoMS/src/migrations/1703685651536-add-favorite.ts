import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFavorite1703685651536 implements MigrationInterface {
    name = 'AddFavorite1703685651536'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`favorite\` (\`id\` int NOT NULL AUTO_INCREMENT, \`contentId\` int NOT NULL, \`contentType\` enum ('product', 'idea') NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`favorite\``);
    }

}
