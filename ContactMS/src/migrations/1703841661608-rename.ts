import { MigrationInterface, QueryRunner } from "typeorm";

export class Rename1703841661608 implements MigrationInterface {
    name = 'Rename1703841661608'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`address\` CHANGE \`district\` \`ward\` varchar(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`address\` CHANGE \`city\` \`district\` varchar(50) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`address\` CHANGE \`district\` \`city\` varchar(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`address\` CHANGE \`ward\` \`district\` varchar(50) NOT NULL`);
    }

}
