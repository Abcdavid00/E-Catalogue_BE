import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveProductImage1703627493196 implements MigrationInterface {
    name = 'RemoveProductImage1703627493196'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`product_image\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`product_image\` (\`id\` int NOT NULL AUTO_INCREMENT, \`product_id\` int NOT NULL, \`image\` varchar(40) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

}
