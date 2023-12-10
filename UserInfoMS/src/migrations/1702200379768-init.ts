import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1702200379768 implements MigrationInterface {
    name = 'Init1702200379768'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user_info\` (\`id\` int NOT NULL AUTO_INCREMENT, \`fullname\` varchar(50) NOT NULL, \`phone\` varchar(10) NOT NULL, \`sex\` enum ('male', 'female', 'unknown') NOT NULL DEFAULT 'unknown', \`dob\` date NOT NULL, \`profile_image\` varchar(40) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`user_info\``);
    }

}
