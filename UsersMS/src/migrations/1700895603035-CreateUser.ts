import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUser1700895603035 implements MigrationInterface {
    name = 'CreateUser1700895603035'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(30) NOT NULL, \`password\` varchar(200) NOT NULL, \`role\` enum ('admin', 'shop_owner', 'customer') NOT NULL DEFAULT 'customer', UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
    }

}
