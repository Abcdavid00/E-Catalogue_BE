import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStoreFollower1704050274127 implements MigrationInterface {
    name = 'AddStoreFollower1704050274127'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`store_follower\` (\`storeId\` int NOT NULL, \`userId\` int NOT NULL, PRIMARY KEY (\`storeId\`, \`userId\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`store_follower\``);
    }

}
