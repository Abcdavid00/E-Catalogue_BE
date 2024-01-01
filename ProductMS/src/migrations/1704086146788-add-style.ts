import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStyle1704086146788 implements MigrationInterface {
    name = 'AddStyle1704086146788'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`rectangle\` (\`id\` int NOT NULL AUTO_INCREMENT, \`minX\` double NOT NULL, \`minY\` double NOT NULL, \`maxX\` double NOT NULL, \`maxY\` double NOT NULL, \`styleId\` int NOT NULL, \`variantId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`style_image\` (\`id\` int NOT NULL AUTO_INCREMENT, \`image\` varchar(40) NOT NULL, \`styleId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`style\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(150) NOT NULL, \`category\` enum ('popular', 'minimal', 'business', 'street', 'performance', 'unique', 'lovely', 'easyCasual', 'american', 'cityBoy', 'sporty', 'retro', 'modern') NOT NULL, \`mainImage\` varchar(40) NOT NULL, \`width\` int NOT NULL, \`height\` int NOT NULL, \`storeId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`rectangle\` ADD CONSTRAINT \`FK_997fab35c8e189882a3816f03ae\` FOREIGN KEY (\`styleId\`) REFERENCES \`style\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`rectangle\` ADD CONSTRAINT \`FK_f121a5152208a5c36682525e01d\` FOREIGN KEY (\`variantId\`) REFERENCES \`product_variant\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`style_image\` ADD CONSTRAINT \`FK_1f468a583e10985477e106b4aae\` FOREIGN KEY (\`styleId\`) REFERENCES \`style\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`style\` ADD CONSTRAINT \`FK_d8fcf5d90be19a11e01d661f4cd\` FOREIGN KEY (\`storeId\`) REFERENCES \`store\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`style\` DROP FOREIGN KEY \`FK_d8fcf5d90be19a11e01d661f4cd\``);
        await queryRunner.query(`ALTER TABLE \`style_image\` DROP FOREIGN KEY \`FK_1f468a583e10985477e106b4aae\``);
        await queryRunner.query(`ALTER TABLE \`rectangle\` DROP FOREIGN KEY \`FK_f121a5152208a5c36682525e01d\``);
        await queryRunner.query(`ALTER TABLE \`rectangle\` DROP FOREIGN KEY \`FK_997fab35c8e189882a3816f03ae\``);
        await queryRunner.query(`DROP TABLE \`style\``);
        await queryRunner.query(`DROP TABLE \`style_image\``);
        await queryRunner.query(`DROP TABLE \`rectangle\``);
    }

}
