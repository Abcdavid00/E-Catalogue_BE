import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStoreVisitor1704147569001 implements MigrationInterface {
    name = 'AddStoreVisitor1704147569001'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`store_visitor\` (\`storeId\` int NOT NULL, \`userId\` int NOT NULL, PRIMARY KEY (\`storeId\`, \`userId\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`store_visitor\``);
    }

}
