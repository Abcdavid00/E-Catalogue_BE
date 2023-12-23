import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1703321650918 implements MigrationInterface {
    name = 'Init1703321650918'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`address\` (\`id\` int NOT NULL AUTO_INCREMENT, \`province\` varchar(50) NOT NULL, \`city\` varchar(50) NOT NULL, \`district\` varchar(50) NOT NULL, \`details\` varchar(500) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`contact\` (\`id\` int NOT NULL AUTO_INCREMENT, \`phone\` varchar(10) NOT NULL, \`addressId\` int NULL, UNIQUE INDEX \`REL_d7748995636532d90c30dbd760\` (\`addressId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`contact\` ADD CONSTRAINT \`FK_d7748995636532d90c30dbd7603\` FOREIGN KEY (\`addressId\`) REFERENCES \`address\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`contact\` DROP FOREIGN KEY \`FK_d7748995636532d90c30dbd7603\``);
        await queryRunner.query(`DROP INDEX \`REL_d7748995636532d90c30dbd760\` ON \`contact\``);
        await queryRunner.query(`DROP TABLE \`contact\``);
        await queryRunner.query(`DROP TABLE \`address\``);
    }

}
