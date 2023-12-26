import { MigrationInterface, QueryRunner } from "typeorm";

export class ReAddProductImage1703627635284 implements MigrationInterface {
    name = 'ReAddProductImage1703627635284'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`product_image\` (\`id\` int NOT NULL AUTO_INCREMENT, \`image\` varchar(40) NOT NULL, \`productId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`product_image\` ADD CONSTRAINT \`FK_40ca0cd115ef1ff35351bed8da2\` FOREIGN KEY (\`productId\`) REFERENCES \`product\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product_image\` DROP FOREIGN KEY \`FK_40ca0cd115ef1ff35351bed8da2\``);
        await queryRunner.query(`DROP TABLE \`product_image\``);
    }

}
